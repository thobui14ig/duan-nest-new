import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/login-auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body() loginAuthDto: AuthLoginDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('reset-password')
  resetPassword(@Body('email') email: string) {
    return this.authService.resetPassword(email);
  }
}
