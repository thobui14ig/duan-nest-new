import { ChatRoom, ChatRoomDocument } from './schemas/chat-room';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { Model } from 'mongoose';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoomDocument>,
  ) {}

  create(createChatRoomDto: CreateChatRoomDto) {
    console.log(createChatRoomDto);
    return 'This action adds a new chatRoom';
  }

  async createRoom(userId: string) {
    const currentUserId = '63a6cae6d4b4cc4dde8f9098';

    const checkExitsRoom = await this.chatRoomModel.findOne({
      users: { $in: [userId, currentUserId] },
    });

    if (!checkExitsRoom) {
      return this.chatRoomModel.create({
        users: [userId, currentUserId],
        messages: [],
      });
    }

    return checkExitsRoom;
  }

  findAll() {
    return this.chatRoomModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} chatRoom`;
  }

  update(id: number, updateChatRoomDto: UpdateChatRoomDto) {
    return updateChatRoomDto;
  }

  remove(id: number) {
    return `This action removes a #${id} chatRoom`;
  }
}
