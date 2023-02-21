import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { GatewayModules } from './gatewaies/gateway.modules';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:root@cluster0.0aue7m9.mongodb.net/?retryWrites=true&w=majority',
      {
        dbName: 'asana',
      },
    ),
    UsersModule,
    AuthModule,
    GatewayModules,
    ChatRoomModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
