import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {
  constructor(
    // inject userService
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    // inject hashingprovider
    private readonly hashingProvider: HashingProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    // find the user using email ID
    // Throw an error if the user does not exist
    let user = await this.userService.findOneByEmail(signInDto.email);
    // compare  password to the hash
    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect Password');
    }

    // send confirmation
    return true;
  }
}
