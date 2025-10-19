import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokenProvider } from 'src/auth/providers/generate-token.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    // inject jwtConfiguration
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    // inject userService
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    // inject generateTokensProvider
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientIdSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientIdSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      // verify the Google Token sent by User
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      // Extract the payload from Google JWT
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload() || {};

      // Validate required fields
      if (!email || !googleId || !firstName) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      // Find the user in the database using the GoogleId
      const user = await this.userService.findOneByGoogleId(googleId);
      // If googleId exists generate token
      if (user) {
        return await this.generateTokenProvider.generateTokens(user);
      }
      // If not create a new user and then generate token
      const newUser = await this.userService.createGoogleUser({
        email,
        firstName,
        lastName: lastName || '',
        googleId,
      });
      return this.generateTokenProvider.generateTokens(newUser);
    } catch (error) {
      // throw unauthorised exception
      throw new UnauthorizedException(error);
    }
  }
}
