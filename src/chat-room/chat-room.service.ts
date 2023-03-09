import { ChatUser, ChatUserDocument } from './schemas/chat-user';
import { UserDocument } from './../users/schemas/users.schema';
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
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel(ChatUser.name)
    private readonly chatUserModel: Model<ChatUserDocument>,
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

      const room = await this.chatRoomModel.findOne({
        _id: new ObjectId(roomId),
      });

      for (const user of room.users) {
        const checkUser = await this.chatUserModel.findOne({
          roomId: new ObjectId(roomId),
          userId: new ObjectId(userId),
        });
        // //nếu là người tạo thì isRead bằng true
        const isRead = userId.toString() === user.toString() ? true : false;
        if (!checkUser) {
          await this.chatUserModel.create({
            roomId,
            userId: user,
            isRead,
          });
        } else {
          await this.chatUserModel.updateOne(
            {
              roomId: new ObjectId(roomId),
              userId: user,
            },
            {
              $set: { isRead: isRead },
            },
          );
        }
      }

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

  async remove(roomId: string) {
    const room = await this.chatRoomModel.findOne({
      _id: new ObjectId(roomId),
    });
    for (const user of room.users) {
      await this.userService.deleteRoomInUser(roomId, user.toString());
    }

    return this.chatRoomModel.deleteOne({ _id: new ObjectId(roomId) });
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

  getListUsers(roomId: string) {
    return this.chatRoomModel
      .findOne({
        _id: new ObjectId(roomId),
      })
      .populate({
        path: 'users',
        select: 'name email _id',
        // select: 'name email -_id',
        model: this.userModel,
      })
      .select('users name');
  }

  async setIsReadTrue(roomId: string, userId: string) {
    const checkUser = await this.chatUserModel.findOne({
      roomId: new ObjectId(roomId),
      userId: new ObjectId(userId),
    });

    if (!checkUser) {
      await this.chatUserModel.create({
        roomId,
        userId: userId,
        isRead: true,
      });
    } else {
      await this.chatUserModel.updateOne(
        {
          roomId: new ObjectId(roomId),
          userId: new ObjectId(userId),
        },
        {
          $set: { isRead: true },
        },
      );
    }
  }

  async editGroup(roomId: string, body: any) {
    const { title, listUsersGroup, listUsersGroupDelete } = body;
    //xoa danh sach chat trong user
    for (const user of listUsersGroupDelete) {
      await this.userService.deleteRoomInUser(roomId, user);
    }

    const room = await this.chatRoomModel.findOne({
      _id: new ObjectId(roomId),
    });
    //them user moi
    const newUser = listUsersGroup.filter((elem) => !room.users.includes(elem));
    for (const user of newUser) {
      await this.userService.updateListChatRooms(user, roomId);
    }

    room.users = listUsersGroup;
    room.name = title;
    return room.save();
  }

  async getAttachments(roomId: string) {
    const [listAttachments] = await this.chatRoomModel
      .aggregate([
        {
          $lookup: {
            from: 'attachments',
            localField: 'attachments',
            foreignField: '_id',
            as: 'attachments',
          },
        },
        { $match: { _id: new ObjectId(roomId) } },
        {
          $project: {
            _id: 1,
            'attachments.path': 1,
            'attachments.name': 1,
            'attachments._id': 1,
          },
        },
      ])
      .exec();

    return listAttachments;
  }
}
