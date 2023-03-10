import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RoleService } from '../../role/role.service';

@Injectable()
export class DUserInterceptor implements NestInterceptor {
  constructor(private roleService: RoleService) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();

    const user = request['user'];

    const roles = await this.roleService.findOne(user.id);

    if (Number(user.role) === 3) {
      if (!roles.dUser) {
        throw new Error('Interceptor error');
      }
    }

    return next.handle().pipe();
  }
}
