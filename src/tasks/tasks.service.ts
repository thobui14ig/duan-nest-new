import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createReadStream } from 'fs';
import mongoose, { Model } from 'mongoose';
import { join } from 'path';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Attachment, AttachmentDocument } from './schemas/attachment';
import { Tasks, TasksDocument } from './schemas/task';
const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Tasks.name)
    private readonly taskModel: Model<TasksDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentModel: Model<AttachmentDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return this.taskModel.create({ ...createTaskDto, createdBy: userId });
  }

  findAll(user: any) {
    const { role, id: _id } = user;
    if (role === 1) {
      return this.taskModel.find().sort({ createdAt: -1 });
    } else {
      return this.taskModel
        .find({ assigne: new ObjectId(_id) })
        .sort({ createdAt: -1 });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.taskModel.updateOne(
      { _id: id },
      {
        $set: updateTaskDto,
      },
    );
  }

  remove(id: string) {
    return this.taskModel.deleteOne({ _id: id });
  }

  async insertFileReport(
    taskId: string,
    file: Express.Multer.File,
    userCreate: string,
  ) {
    console.log(11, file);
    const acttachment = await this.attachmentModel.create({
      name: file.filename,
      createdBy: userCreate,
      task: taskId,
    });

    return this.taskModel.updateOne(
      { _id: taskId },
      { $push: { attachments: acttachment._id } },
    );
  }

  async getAttachments(taskId: string) {
    const [listAttachments] = await this.taskModel
      .aggregate([
        {
          $lookup: {
            from: 'attachments',
            localField: 'attachments',
            foreignField: '_id',
            as: 'attachments',
          },
        },
        { $match: { _id: new ObjectId(taskId) } },
        {
          $project: {
            _id: 1,
            'attachments.name': 1,
            'attachments._id': 1,
          },
        },
      ])
      .exec();

    return listAttachments;
  }

  downloadFile(fileName: string, res: any) {
    const file = createReadStream(join(__dirname, '..', 'uploads', fileName));
    res.setHeader('Content-Type', 'application/octet-stream');
    file.pipe(res);
  }
}
