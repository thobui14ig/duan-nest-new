import { User, UserDocument } from './schemas/users.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Model } from 'mongoose';
import { exec } from 'child_process';
const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  create(createUserDto: CreateUserDto, userId: string) {
    return this.userModel.create({ ...createUserDto, createdBy: userId });
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
            'listChats.read': 1,
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
}
