import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Roles, RolesSchema } from './schemas/roles.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Roles.name, schema: RolesSchema }]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
