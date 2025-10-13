import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { postStatus } from '../enums/postStatus.enum';
import { postType } from '../enums/postType.enums';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'This is the title for blog post',
    example: 'This is a title',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: "Possible values, 'post', 'page', 'story', 'series'",
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: "For example - 'my-url'",
    example: 'my-blog-post',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces.For example "my-url"',
  })
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: "Possible values, 'draft', 'published', 'review', 'scheduled'",
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: 'This is the content for blog post',
    example: 'The post content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description:
      'Serialize your JSON object else a validation error will be thrown',
    example:
      '{\r\n \"@context\":\"https:\/\/schema.org\",\r\n \"@type\":\"Person\"\r\n }',
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Featured image for blog post',
    example: 'https://example.com/images/image1.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImage?: string;

  @ApiPropertyOptional({
    description: 'The date on which the blog post is published',
    example: '2024-03-16T07:46:32+0000',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of ids of tags',
    example: [1, 2],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tags?: number[];

  @ApiPropertyOptional({
    description:
      'Meta configuration object stored alongside the post. Provide a JSON string in `metaValue`.',
    type: () => CreatePostMetaOptionsDto,
    example: {
      metaValue: '{"sidebarEnabled": true}',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto;

  @ApiProperty({
    type: 'integer',
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  authorId: number;
}
