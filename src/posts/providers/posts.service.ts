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
      relations: { metaOptions: true },
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

    let post = this.postsRepository.create({
      ...createPostDto,
      author: author!,
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
}
