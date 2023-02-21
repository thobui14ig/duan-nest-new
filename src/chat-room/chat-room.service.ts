import { ChatRoom, ChatRoomDocument } from './schemas/chat-room';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { Model } from 'mongoose';

@Injectable()
export class ChatRoomService {
  constructor(@InjectModel(ChatRoom.name) private readonly chatRoomModel: Model<ChatRoomDocument>) {}

  create(createChatRoomDto: CreateChatRoomDto) {
    console.log(createChatRoomDto);
    return 'This action adds a new chatRoom';
  }

  createRoom(userId: string) {
    // return this.chatRoomModel.create({
    //   users: ['123', '333'],
    //   messages: ['213','321312']
    // })
    console.log(userId);
    const createdCat = new this.chatRoomModel({
      users: ['63ac5e65d3ea49c7ad9002bd', '63ac5e65d3ea49c7ad900211'],
      messages: ['63ac5e65d3ea49c7ad9002b3'],
    });
    return createdCat.save();
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
