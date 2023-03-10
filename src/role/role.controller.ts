import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Post('/set-roles')
  setPermisionRoles(
    @Body()
    body: CreateRoleDto,
  ) {
    return this.roleService.setPermisionRoles(body);
  }
}
