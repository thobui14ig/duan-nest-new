import { Attachment, AttachmentSchema } from './../tasks/schemas/attachment';
import { ChatUser, ChatUserSchema } from './schemas/chat-user';
import { User, UserSchema } from './../users/schemas/users.schema';
import { UsersModule } from './../users/users.module';
import { Messages, MessagesSchema } from './schemas/messages';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoom, ChatRoomSchema } from './schemas/chat-room';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Messages.name, schema: MessagesSchema },
      { name: User.name, schema: UserSchema },
      { name: ChatUser.name, schema: ChatUserSchema },
      { name: Attachment.name, schema: AttachmentSchema },
    ]),
    UsersModule,
  ],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
})
export class ChatRoomModule {}
