import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoom, ChatRoomSchema } from './schemas/chat-room';

@Module({
  imports: [MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }])],
  controllers: [ChatRoomController],
  providers: [ChatRoomService]
})
export class ChatRoomModule {}
