import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request);
    return true;
  }
}

function validateRequest(request) {
  // Your authentication logic here
  if (request.headers.authorization === 'Bearer my_token') {
    return true;
  } else {
    return false;
  }
}
