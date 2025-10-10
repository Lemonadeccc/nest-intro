import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    public readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}
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

  public async create(@Body() createPostDto: CreatePostDto) {
    //Create metaOptions
    const metaOptionsDto = createPostDto.metaOptions;
    const metaOptions = metaOptionsDto
      ? this.metaOptionsRepository.create(metaOptionsDto)
      : undefined;
    if (metaOptions) {
      await this.metaOptionsRepository.save(metaOptions);
    }
    // Create psot
    const post = this.postsRepository.create({
      ...createPostDto,
      metaOptions,
    });

    // Add metaOptions to the post
    if (metaOptions) {
      post.metaOptions = metaOptions;
    }
    //return the post
    return await this.postsRepository.save(post);
  }
}
