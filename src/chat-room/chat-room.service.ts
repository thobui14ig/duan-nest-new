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

  async sendMessage(message: MessageDto, userId = '63a6cae6d4b4cc4dde8f9098') {
    const { content, receiveId, roomId } = message;
    console.log(11, message);

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
