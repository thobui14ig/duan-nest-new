import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { GatewayModules } from './gatewaies/gateway.modules';
import { AuthMiddleware } from './libs/middlwares/auth-middlware';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';

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

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
      exclude: ['/api*'], // Exclude API routes
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),

    UsersModule,
    AuthModule,
    GatewayModules,
    ChatRoomModule,
    TasksModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
