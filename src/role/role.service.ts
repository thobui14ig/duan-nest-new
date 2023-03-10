import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { Roles, RolesDocument } from './schemas/roles.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Roles.name)
    private readonly roleModel: Model<RolesDocument>,
  ) {}

  findOne(id: string) {
    return this.roleModel.findOne({ userId: id });
  }

  async setPermisionRoles(body: CreateRoleDto) {
    const { roles, userId } = body;
    const { isCreate, isDelete, isUpdate } = roles;
    const filter = { userId };
    const update = { cUser: isCreate, dUser: isDelete, uUser: isUpdate };
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };

    const updatedUserRole = await this.roleModel.findOneAndUpdate(
      filter,
      update,
      options,
    );

    return updatedUserRole;
  }
}
