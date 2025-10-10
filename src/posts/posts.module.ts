import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Post, MetaOption])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
