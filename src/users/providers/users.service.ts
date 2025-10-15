import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersPrarmDto } from '../dtos/get-users-prarm.dto';
import { AuthService } from '../../auth/providers/auth.service';
import { User } from '../user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';
import { env } from 'process';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';

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
    private readonly configService: ConfigService,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    // 移到 users-create-many.service.ts里了
    // // Inject DataSource
    // private readonly dataSource: DataSource,

    // Inject usersCreateManyProvider
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
  ) {}

  /**
   * The method to get all the users from the database
   */
  public findAll(
    getUsersPrarmDto: GetUsersPrarmDto,
    limit: number,
    page: number,
  ) {
    // const environment = this.configService.get<string>('S3_BUCKET');
    // console.log(environment);

    // console.log(this.profileConfiguration);
    // console.log(this.profileConfiguration.apiKey);
    // const isAuth = this.authService.isAuth();
    // console.log(isAuth);
    // return [
    //   {
    //     firstName: 'John',
    //     email: 'john@gmail.com',
    //   },
    //   {
    //     firstName: 'Alice',
    //     email: 'alice@doe.com',
    //   },
    // ];

    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist',
        fileName: 'users.serivce.ts',
        lineNumber: 88,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured because the API endpoint was permanently moved.',
      },
    );
  }

  /**
   * Find a Single user using the ID of the user
   */
  public async findOneById(id: number) {
    // return {
    //   id: 123,
    //   firstName: 'Alice',
    //   email: 'alice@doe.com',
    // };

    return await this.userRepository.findOneBy({
      id,
    });
  }

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;

    try {
      existingUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
    } catch (error) {
      // 数据库连接错误
      // 返回的json里 message是上面那个，error是下面描述的文字
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists,please check your email',
      );
    }

    let newUser = this.userRepository.create(createUserDto);
    newUser = await this.userRepository.save(newUser);

    return newUser;
  }

  public async createMany(createUsersDto: CreateUserDto[]) {
    // let newUsers: User[] = [];
    // // Create query runner Instance
    // const queryRunner = this.dataSource.createQueryRunner();
    // // Connect Query Runner to datasource
    // await queryRunner.connect();
    // // Start Transaction
    // await queryRunner.startTransaction();
    // try {
    //   for (let user of createUsersDto) {
    //     let newUser = queryRunner.manager.create(User, user);
    //     let result = await queryRunner.manager.save(newUser);
    //     newUsers.push(result);
    //   }
    //   // If successful commit
    //   await queryRunner.commitTransaction();
    // } catch (error) {
    //   // If unsuccessful rollback
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   // Release connection
    //   await queryRunner.release();
    // }

    return await this.usersCreateManyProvider.createMany(createUsersDto);
  }
}
