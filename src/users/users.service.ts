import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersPrarmDto } from './dtos/get-users-prarm.dto';
import { AuthService } from 'src/auth/providers/auth.service';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**
   * The method to get all the users from the database
   */
  public findAll(
    getUsersPrarmDto: GetUsersPrarmDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);

    return [
      {
        firstName: 'John',
        email: 'john@gmail.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }

  /**
   * Find a Single user using the ID of the user
   */
  public findOneById(id: string) {
    return {
      id: 123,
      firstName: 'Alice',
      email: 'alice@doe.com',
    };
  }
}
