import { ChatRoom, ChatRoomSchema } from './../chat-room/schemas/chat-room';
import { User, UserSchema } from './schemas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
    RoleModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
