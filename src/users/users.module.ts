import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [forwardRef(() => AuthModule)],
})
export class UsersModule {}
