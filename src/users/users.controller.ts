import { CUserInterceptor } from './decorators/check-permission-create.interceptor';
import { DUserInterceptor } from './decorators/check-permission-delete.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UUserInterceptor } from './decorators/check-permission-update.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(CUserInterceptor)
  create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const { id } = req.user;
    return this.usersService.create(createUserDto, id);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(UUserInterceptor)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseInterceptors(DUserInterceptor)
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
