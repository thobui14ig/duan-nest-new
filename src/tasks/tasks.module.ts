import { extname } from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as multer from 'multer';
import { Tasks, TasksSchema } from './schemas/task';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';

const multerOptions: MulterModuleOptions = {
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      console.log(randomName);

      return cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};
@Module({
  imports: [
    MulterModule.register(multerOptions),
    MongooseModule.forFeature([{ name: Tasks.name, schema: TasksSchema }]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
