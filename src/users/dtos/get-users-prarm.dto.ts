import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersPrarmDto {
  @ApiPropertyOptional({
    description: 'Get user with a specific id',
    example: 123,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
