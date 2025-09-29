import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Req,
  Headers,
  Ip,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersPrarmDto } from './dtos/get-users-prarm.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('/:id/{:optional}')
  public getUsers(
    // @Param('id', ParseIntPipe) id: number | undefined,
    @Param() getUserParamDto: GetUsersPrarmDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
  ) {
    // console.log(id);
    // console.log(typeof id);
    // console.log(limit);
    // console.log(offset);
    // console.log(getUserParamDto);
    // return 'Getting all users';
    return this.userService.findAll(getUserParamDto, limit, offset);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    console.log(createUserDto instanceof CreateUserDto);
    return 'post created';
  }

  @Patch()
  public pathuser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
