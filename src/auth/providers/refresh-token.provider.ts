import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { GenerateTokenProvider } from './generate-token.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user.interface';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly generateTokenProvider: GenerateTokenProvider,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify the refresh token
      const { sub } =
        (await this.jwtService.verifyAsync) <
        Pick<ActiveUserData, 'sub'>(refreshTokenDto.refreshToken, {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        });
      // fetch user from the database
      const user = await this.userService.findOneById(sub);
      // generate the tokens
      return await this.generateTokenProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
