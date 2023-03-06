import { JwtService } from '@nestjs/jwt';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    // Retrieve the user token from wherever it is stored (e.g., session, cookie, header)
    const userToken = req.headers.x_authorization;
    console.log(1111, req.headers);
    if (userToken) {
      const decoded = this.jwtService.verify(userToken as string);
      // Assign the token to the request headers or cookies
      req['user'] = decoded;
      // Call the next middleware function
    }

    next();
  }
}
