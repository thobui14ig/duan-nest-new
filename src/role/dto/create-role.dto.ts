export class CreateRoleDto {
  roles: {
    isCreate: boolean;
    isUpdate: boolean;
    isDelete: boolean;
  };
  userId: string;
}
