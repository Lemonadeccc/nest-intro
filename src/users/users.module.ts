import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import profileConfig from './config/profile.config';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [
    UsersService,
    UsersCreateManyProvider,
    CreateUserProvider,
    FindOneUserByEmailProvider,
  ],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class UsersModule {}
