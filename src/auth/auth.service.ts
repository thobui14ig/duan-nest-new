/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { AuthLoginDto } from './dto/login-auth.dto';
import { MailerService } from '@nest-modules/mailer/dist';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailServer: MailerService,
  ) {}

  async login(dto: AuthLoginDto) {
    const user = await this.userService.findByNamePassword({
      name: dto.name,
      password: dto.password,
    });

    if (user)
      return {
        accessToken: this.SinUser(user._id.toString(), user.name, user.role),
        user,
      };
    else return false;
  }

  SinUser(userId: string, name: string, role: number) {
    return this.jwtService.sign({
      sub: userId,
      name,
      id: userId,
      role,
    });
  }

  async resetPassword(email: string) {
    const user = await this.userService.findByEmail(
      'buithanhtho14ig@gmail.com',
    );
    const randomString = Math.random().toString(36).substring(2, 8);
    user.password = randomString
    await user.save()

    return this.mailServer.sendMail({
      to: user?.email,
      subject: `Quên mật khẩu`,
      template: './password',
      context: {
        password: randomString,
      },
    });
  }
}
