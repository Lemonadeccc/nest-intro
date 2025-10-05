import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersPrarmDto } from '../dtos/get-users-prarm.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    let newUser = this.userRepository.create(createUserDto);
    newUser = await this.userRepository.save(newUser);

    return newUser;
  }
}
