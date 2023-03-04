import { CreateChatGroupDto } from './dto/create-group-room';
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
      type: 'user',
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

  async getRoom(roomId: string) {
    return this.chatRoomModel.findOne({
      _id: new ObjectId(roomId),
    });
  }

  async sendMessage(message: MessageDto, userId: string) {
    const { content, receiveId, roomId } = message;
    if (message) {
      const messageReturn = await this.messageModel.create({
        content,
        createdBy: userId,
      });
      await this.chatRoomModel.updateOne(
        { _id: new ObjectId(roomId) },
        { $push: { messages: messageReturn._id } },
      );

      return messageReturn;
    }
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

  async createGroup(body: CreateChatGroupDto) {
    const data = await this.chatRoomModel.create(body);
    for (const id of body.users) {
      await this.userService.updateListChatRooms(id, data._id.toString());
    }
  }

  async removeMessage(messageId: string, roomId: string) {
    await this.messageModel.deleteOne({
      _id: new ObjectId(messageId),
    });

    await this.chatRoomModel.findOneAndUpdate(
      { _id: new ObjectId(roomId) },
      {
        $pull: { messages: messageId },
      },
    );
  }
}
