import { User, UserDocument } from './schemas/users.schema';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Model } from 'mongoose';
import { MailerService } from '@nest-modules/mailer';
import { HttpException } from '@nestjs/common/exceptions';
const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private mailServer: MailerService,
  ) {}

  async create(createUserDto: any, userId: string) {
    const checkEmail = await this.findByEmail(createUserDto?.email);
    if (checkEmail) {
      throw new HttpException('Email đã tồn tại', HttpStatus.FORBIDDEN);
    }

    const checkName = await this.findByName(createUserDto?.name);
    if (checkName) {
      throw new HttpException(
        'Tên đăng nhập đã tồn tại!',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userModel.create({
      ...createUserDto,
      createdBy: userId,
    });

    this.mailServer.sendMail({
      to: createUserDto?.email,
      subject: `Tài khoản mới`,
      template: './newuser',
      context: {
        username: createUserDto.name,
        password: createUserDto.password,
      },
    });

    return user;
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findOne({ _id: new ObjectId(id) });
  }

  findByNamePassword(dto: { name: string; password: string }) {
    return this.userModel.findOne(dto);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  findByName(name: string) {
    return this.userModel.findOne({ name });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne(
      { _id: id },
      {
        $set: updateUserDto,
      },
    );
  }

  remove(id: number) {
    return this.userModel.deleteOne({ _id: id });
  }

  updateListChatRooms(userId: string, roomId: string) {
    return this.userModel.updateOne(
      { _id: userId },
      { $push: { listChats: roomId } },
    );
  }

  async getListRooms(userId: string) {
    const [listChats] = await this.userModel
      .aggregate([
        {
          $lookup: {
            from: 'chats',
            localField: 'listChats',
            foreignField: '_id',
            as: 'listChats',
          },
        },
        { $match: { _id: new ObjectId(userId) } },
        {
          $project: {
            _id: 1,
            'listChats._id': 1,
            'listChats.users': 1,
            'listChats.name': 1,
            'listChats.type': 1,
            'listChats.createdAt': 1,
            'listChats.updatedAt': 1,
            'listChats.chatUser.isRead': 1,
          },
        },
        { $unwind: '$listChats' },
        {
          $lookup: {
            from: 'chatuser',
            let: { roomId: '$listChats._id', userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$roomId', '$$roomId'] },
                      { $eq: ['$userId', '$$userId'] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  isRead: 1, // Include only the isRead field from chatuser
                },
              },
            ],
            as: 'chatUser',
          },
        },
        {
          $addFields: {
            'listChats.chatUser': { $arrayElemAt: ['$chatUser', 0] },
          },
        },

        { $sort: { 'listChats.updatedAt': -1 } },
        {
          $group: {
            _id: '$_id',
            listChats: { $push: '$listChats' },
          },
        },
      ])
      .exec();

    return listChats;
  }

  deleteRoomInUser(roomId: string, userId: string) {
    return this.userModel.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $pull: { listChats: roomId },
      },
    );
  }
}
