import { UsersService } from './../users.service';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RoleService } from '../../role/role.service';

@Injectable()
export class DUserInterceptor implements NestInterceptor {
  constructor(
    private roleService: RoleService,
    private userService: UsersService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();

    const user = request['user'];

    const roles = await this.roleService.findOne(user.id);

    if (Number(user.role) === 3) {
      const userId = request.params.id;
      const userDelete = await this.userService.findOne(userId);
      if (userDelete.role === 1) {
        throw new HttpException(
          'Bạn không có quyền xoá Admin',
          HttpStatus.FORBIDDEN,
        );
      }

      if (!roles.dUser) {
        throw new HttpException('Bạn không có quyền xoá', HttpStatus.FORBIDDEN);
      }
    }

    return next.handle().pipe();
  }
}
