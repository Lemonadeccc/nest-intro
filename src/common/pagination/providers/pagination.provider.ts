import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationProvider {
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ) {
    let results = await repository.find({
      skip: (paginationQuery.page! - 1) * paginationQuery.limit!,
      take: paginationQuery.limit,
    });
    return results;
  }
}
