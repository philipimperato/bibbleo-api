import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import FindAllQuery from '../../http/interfaces/find-all-query';
import FindAllResult from '../../http/interfaces/find-all-result';
import { User } from './entities/user.model';
import { FindAllInterceptor } from '../../http/interceptors/find-all';
import { FindOneInterceptor } from '../../http/interceptors/find-one';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { password } = createUserDto;

    createUserDto.password = await bcrypt.hash(password, 10);

    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseInterceptors(FindAllInterceptor<User>)
  async findAll(@Query() query: FindAllQuery): Promise<FindAllResult<User>> {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @UseInterceptors(FindOneInterceptor<User>)
  findOne(@Param('id') id: string) {
    const user = this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
