import { Injectable } from '@nestjs/common';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepostory: Repository<Tag>,
  ) {}

  public async create(careateTagDto: CreateTagDto) {
    let tag = this.tagsRepostory.create(careateTagDto);
    return await this.tagsRepostory.save(tag);
  }

  public async findMultipleTags(tags: number[]) {
    let results = await this.tagsRepostory.find({
      where: {
        id: In(tags),
      },
    });
    return results;
  }
}
