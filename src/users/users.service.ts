import { Injectable } from '@nestjs/common';
import { GetUsersPrarmDto } from './dtos/get-users-prarm.dto';

@Injectable()
export class UsersService {
  public findAll(
    getUsersPrarmDto: GetUsersPrarmDto,
    limit: number,
    offset: number,
  ) {
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
}
