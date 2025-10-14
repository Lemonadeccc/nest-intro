import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    private readonly tagsService: TagsService,
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

  public async findAll(userId: string) {
    // const user = this.usersService.findOneById(userId);
    let posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        // , author: true, tags: true
      },
    });
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
    // find the post
    let post = await this.postsRepository.findOneBy({
      id: patchPostDto.id,
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // find the tags only if tags are provided
    if (patchPostDto.tags) {
      const tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
      post.tags = tags;
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
    return await this.postsRepository.save(post);
  }
}
