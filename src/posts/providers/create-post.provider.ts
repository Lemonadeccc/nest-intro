import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly tagsService: TagsService,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    // //Create metaOptions
    // const metaOptionsDto = createPostDto.metaOptions;
    // const metaOptions = metaOptionsDto
    //   ? this.metaOptionsRepository.create(metaOptionsDto)
    //   : undefined;
    // if (metaOptions) {
    //   await this.metaOptionsRepository.save(metaOptions);
    // }
    // // Create psot
    // const post = this.postsRepository.create({
    //   ...createPostDto,
    //   metaOptions,
    // });

    // // Add metaOptions to the post
    // if (metaOptions) {
    //   post.metaOptions = metaOptions;
    // }
    // //return the post
    // return await this.postsRepository.save(post);

    // 6.16
    //Find author from database based on authorId

    let author;
    let tags;
    try {
      author = await this.usersService.findOneById(user.sub);
      tags = createPostDto.tags
        ? await this.tagsService.findMultipleTags(createPostDto.tags)
        : [];
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto.tags?.length !== tags.length) {
      throw new BadRequestException('Please check your tag Ids');
    }

    let post = this.postsRepository.create({
      ...createPostDto,
      author: author!,
      tags: tags,
    });

    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not a duplicate',
      });
    }
  }
}
