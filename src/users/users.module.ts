import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
