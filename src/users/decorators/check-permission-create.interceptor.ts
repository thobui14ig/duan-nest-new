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
export class CUserInterceptor implements NestInterceptor {
  constructor(private roleService: RoleService) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();

    const user = request['user'];

    const roles = await this.roleService.findOne(user.id);

    if (Number(user.role) === 3) {
      if (!roles.cUser) {
        throw new HttpException(
          'Bạn không có quyền tạo user',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    return next.handle().pipe();
  }
}
