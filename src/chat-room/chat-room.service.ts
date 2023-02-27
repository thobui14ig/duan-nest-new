import { UsersService } from './../users/users.service';
import { MessageDto } from './dto/message-chat-room.dto';
import { ChatRoom, ChatRoomDocument } from './schemas/chat-room';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import mongoose, { Model } from 'mongoose';
import { Messages, MessagesDocument } from './schemas/messages';
const ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoomDocument>,
    @InjectModel(Messages.name)
    private readonly messageModel: Model<MessagesDocument>,
    private userService: UsersService,
  ) {}

  create(createChatRoomDto: CreateChatRoomDto) {
    console.log(createChatRoomDto);
    return 'This action adds a new chatRoom';
  }

  async createRoom(userId: string, currentUserId: string) {
    const checkExitsRoom = await this.chatRoomModel.findOne({
      users: { $all: [userId, currentUserId] },
    });

    if (!checkExitsRoom) {
      const data = await this.chatRoomModel.create({
        users: [userId, currentUserId],
        messages: [],
      });

      for (const id of [userId, currentUserId]) {
        await this.userService.updateListChatRooms(id, data._id.toString());
      }

      return data;
    }

    return checkExitsRoom;
  }

  async sendMessage(message: MessageDto, userId: string) {
    const { content, receiveId, roomId } = message;

    const messageReturn = await this.messageModel.create({
      content,
      createdBy: userId,
    });

    await this.chatRoomModel.updateOne(
      { _id: new ObjectId(roomId) },
      { $push: { messages: messageReturn._id } },
    );
  }

  async getMessages(roomId: string): Promise<ChatRoom> {
    const [chatRoom] = await this.chatRoomModel
      .aggregate([
        {
          $lookup: {
            from: 'messages',
            localField: 'messages',
            foreignField: '_id',
            as: 'messages',
            pipeline: [
              {
                $lookup: {
                  from: 'users',
                  foreignField: '_id',
                  localField: 'createdBy',
                  as: 'createdBy',
                },
              },
              {
                $unwind: '$createdBy', //chi tao ra object
              },
            ],
          },
        },
        { $match: { _id: new ObjectId(roomId) } },
        { $limit: 1 },
      ])
      .exec();

    return chatRoom;
  }

  getListRoom(userId: string) {
    console.log(222, userId);
    return this.userService.getListRooms(userId);
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
