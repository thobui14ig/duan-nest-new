import { User, UserDocument } from './schemas/users.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Model } from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  findAll() {
    return this.userModel.find();
  }

  findByNamePassword(dto: { name: string; password: string }) {
    return this.userModel.findOne(dto);
  }

  findByName(name: string) {
    return this.userModel.findOne({ name });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
            'listChats.users': 1,
            'listChats.createdAt': 1,
            'listChats.updatedAt': 1,
          },
        },
      ])
      .exec();

    return listChats;
  }
}
