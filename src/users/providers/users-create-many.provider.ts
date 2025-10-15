import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}
  public async createMany(createUsersDto: CreateUserDto[]) {
    let newUsers: User[] = [];
    // Create query runner Instance
    const queryRunner = this.dataSource.createQueryRunner();
    // Connect Query Runner to datasource
    await queryRunner.connect();
    // Start Transaction
    await queryRunner.startTransaction();
    try {
      for (let user of createUsersDto) {
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // If successful commit
      await queryRunner.commitTransaction();
    } catch (error) {
      // If unsuccessful rollback
      await queryRunner.rollbackTransaction();
    } finally {
      // Release connection
      await queryRunner.release();
    }
    return newUsers;
  }
}
