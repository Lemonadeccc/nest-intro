import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { UsersService } from 'src/users/users.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/{:userId}')
  public getPosts(@Param('userId') userId: string) {
    return this.postsService.findAll(userId);
  }
}
