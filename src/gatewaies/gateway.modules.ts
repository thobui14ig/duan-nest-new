import { UsersModule } from './../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    JwtModule.register({
      secret: "reset",
    }),
    UsersModule
  ],
  providers: [AppGateway],
  controllers: [],
})
export class GatewayModules {}