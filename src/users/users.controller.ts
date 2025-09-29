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
import { ApiOperation, ApiQuery, ApiTags, ApiResponse } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  // @Get('/:id/{:optional}')
  @Get('/{:id}')
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'The position of the page number that you want to return',
    example: 1,
  })
  public getUsers(
    // @Param('id', ParseIntPipe) id: number | undefined,
    @Param() getUserParamDto: GetUsersPrarmDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    // console.log(id);
    // console.log(typeof id);
    // console.log(limit);
    // console.log(offset);
    // console.log(getUserParamDto);
    // return 'Getting all users';
    return this.userService.findAll(getUserParamDto, limit, page);
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
