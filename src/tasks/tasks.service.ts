import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tasks, TasksDocument } from './schemas/task';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Tasks.name)
    private readonly taskModel: Model<TasksDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return this.taskModel.create({ ...createTaskDto, createdBy: userId });
  }

  findAll() {
    return this.taskModel.find().sort({ createdAt: -1 });
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
}
