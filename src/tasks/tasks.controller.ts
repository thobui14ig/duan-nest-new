import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import console from 'console';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    const { id } = req.user;
    return this.tasksService.create(createTaskDto, id);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.tasksService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post('upload-report/:id/:userCreate')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') taskId: string,
    @Param('userCreate') userCreate: any,
  ) {
    return this.tasksService.insertFileReport(taskId, file, userCreate);
  }

  @Post('upload-file-room/:id/:userCreate')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileRoom(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') roomId: string,
    @Param('userCreate') userCreate: any,
  ) {
    return this.tasksService.insertFileRoom(roomId, file, userCreate);
  }

  @Get('get-attachments/:taskId')
  getAttachment(@Param('taskId') taskId: string) {
    return this.tasksService.getAttachments(taskId);
  }

  @Get('/attachment/:fileName')
  downloadFile(@Param('fileName') fileName: string, @Res() res: any) {
    try {
      return this.tasksService.downloadFile(fileName, res);
    } catch (err) {
      throw new Error('File không tồn tại');
    }
  }

  @Delete('remove-file/:fileId/:taskId')
  removeFile(@Param('fileId') fileId: string, @Param('taskId') taskId: string) {
    return this.tasksService.removeFile(fileId, taskId);
  }
}
