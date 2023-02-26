import { AuthMiddleware } from './libs/middlwares/auth-middlware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { GatewayModules } from './gatewaies/gateway.modules';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:root@cluster0.0aue7m9.mongodb.net/?retryWrites=true&w=majority',
      {
        dbName: 'asana',
      },
    ),
    JwtModule.register({
      secret: 'reset',
    }),
    UsersModule,
    AuthModule,
    GatewayModules,
    ChatRoomModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
