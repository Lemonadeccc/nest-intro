import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokenProvider } from './refresh-token.provider';

@Injectable()
export class AuthService {
  refreshTokenProvider: any;
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    // inject signInProvider
    private readonly signInProvider: SignInProvider,

    //Inject refreshTokenProvider
    private readonly refreshTokensProvider: RefreshTokenProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshToken(refreshTokenDto);
  }

  public isAuth() {
    return true;
  }
}
