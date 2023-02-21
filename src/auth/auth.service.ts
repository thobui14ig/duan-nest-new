/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { AuthLoginDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(dto: AuthLoginDto){
    const user = await this.userService.findByNamePassword({ name: dto.name, password: dto.password });

    if(user) return {
      accessToken: this.SinUser(user._id.toString(), user.name),
      user
    };
    else return false;
  }

  SinUser(userId: string, name: string){
    return this.jwtService.sign({
        sub: userId, 
        name
    })
  }
}

