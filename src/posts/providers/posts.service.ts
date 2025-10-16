import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { GetPostDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    private readonly tagsService: TagsService,
    // injecting paginationProvider
    private readonly paginationProvider: PaginationProvider,
  ) {}
  // public findAll(userId: string) {
  //   const user = this.usersService.findOneById(userId);

  //   return [
  //     {
  //       users: user,
  //       title: 'Test Tile',
  //       content: 'Test Content',
  //     },
  //     {
  //       users: user,
  //       title: 'Test Tile2',
  //       content: 'Test Content 2',
  //     },
  //   ];
  // }

  public async findAll(postQuery: GetPostDto, userId: string) {
    // const user = this.usersService.findOneById(userId);
    // let posts = await this.postsRepository.find({
    //   relations: {
    //     metaOptions: true,
    //     // , author: true, tags: true
    //   },
    //   skip: (postQuery.page! - 1) * postQuery.limit!,
    //   take: postQuery.limit,
    // });

    let posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
    );
    return posts;
  }

  public async create(@Body() createPostDto: CreatePostDto) {
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
    let author = await this.usersService.findOneById(createPostDto.authorId);
    let tags = createPostDto.tags
      ? await this.tagsService.findMultipleTags(createPostDto.tags)
      : [];

    let post = this.postsRepository.create({
      ...createPostDto,
      author: author!,
      tags: tags,
    });
    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    // // Find the post
    // let post = await this.postsRepository.findOneBy({ id });
    // // Deleting the post
    // await this.postsRepository.delete(id);
    // // Delete meta options
    // await this.metaOptionsRepository.delete(post!.metaOptions!.id);
    // // confirmation
    // return { deleted: true, id };

    // 6.14
    // let post = await this.postsRepository.findOneBy({ id });
    // let inversePost = await this.metaOptionsRepository.find({
    //   where: { id: post!.metaOptions!.id },
    //   relations: {
    //     post: true,
    //   },
    // });
    // console.log(inversePost);

    // 6.15
    await this.postsRepository.delete(id);
    return { deleted: true, id };
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags: Tag[] | undefined = undefined;
    let post: Post | null = null;

    // find the post
    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable tot process your request at the moment please try later.',
      );
    }

    if (!post) {
      throw new BadRequestException('The post ID does not exist');
    }

    // find the tags only if tags are provided
    if (patchPostDto.tags) {
      try {
        tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
        post.tags = tags;
      } catch (error) {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment please try later',
        );
      }
    }

    // Number of tags need to be equal
    if (!tags || tags.length !== patchPostDto.tags?.length) {
      throw new BadRequestException(
        'Please check your tag Ids and ensure they are correct.',
      );
    }

    // update the properties
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImage = patchPostDto.featuredImage ?? post.featuredImage;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // save the post and return
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
      );
    }
    return post;
  }
}
