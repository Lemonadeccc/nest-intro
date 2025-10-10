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
    const { metaOptions, ...postPayload } = createPostDto;

    let metaOptionEntity: MetaOption | null = null;
    if (metaOptions && metaOptions.length > 0) {
      metaOptionEntity = this.metaOptionsRepository.create(metaOptions[0]);
      metaOptionEntity = await this.metaOptionsRepository.save(metaOptionEntity);
    }

    const post = this.postsRepository.create(postPayload);

    if (metaOptionEntity) {
      post.metaOptions = metaOptionEntity;
    }

    return this.postsRepository.save(post);
  }
}
