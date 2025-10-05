import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        users: user,
        title: 'Test Tile',
        content: 'Test Content',
      },
      {
        users: user,
        title: 'Test Tile2',
        content: 'Test Content 2',
      },
    ];
  }
}
