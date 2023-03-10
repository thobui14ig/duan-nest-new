import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { CreateChatGroupDto } from './dto/create-group-room';
import { MessageDto } from './dto/message-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@Controller('chat-room')
@ApiTags('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Get('/create-room/:userId')
  createRoom(@Param() params: CreateChatRoomDto, @Req() req: any) {
    const { id: currentUserId } = req.user;
    const { userId } = params;
    return this.chatRoomService.createRoom(userId, currentUserId);
  }

  @Get('/get-room/:roomId')
  getRoom(@Param('roomId') roomId: string) {
    return this.chatRoomService.getRoom(roomId);
  }

  @Post('/send-message')
  sendMessage(@Body() body: MessageDto, @Req() req: any) {
    const { id: currentUserId } = req.user;
    return this.chatRoomService.sendMessage(body, currentUserId);
  }

  @Get('get-messages/:roomId')
  getMessages(@Param('roomId') roomId: string, @Req() req: any) {
    return this.chatRoomService.getMessages(roomId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatRoomService.findOne(+id);
  }

  @Get('/list-rooms/:id')
  getListRoom(@Param('id') userId: string) {
    return this.chatRoomService.getListRoom(userId);
  }

  update(
    @Param('id') id: string,
    @Body() updateChatRoomDto: UpdateChatRoomDto,
  ) {
    return this.chatRoomService.update(+id, updateChatRoomDto);
  }

  @Delete('remove-group/:id')
  remove(@Param('id') id: string) {
    return this.chatRoomService.remove(id);
  }

  @Post('/create-group')
  createGroup(@Body() body: CreateChatGroupDto, @Req() req: any) {
    const { id: currentUserId } = req.user;
    const users = [...body.users, currentUserId];
    body = {
      ...body,
      users,
      createBy: currentUserId,
      read: users.map((item: any) => {
        return {
          user: item,
          isRead: item === currentUserId ? true : false,
        };
      }),
    };

    return this.chatRoomService.createGroup(body);
  }

  @Delete('remove-message/:id/:roomId')
  removeMessage(@Param('id') id: string, @Param('roomId') roomId: string) {
    return this.chatRoomService.removeMessage(id, roomId);
  }

  @Get('/get-users/:id')
  getUsers(@Param('id') roomId: string) {
    return this.chatRoomService.getListUsers(roomId);
  }

  @Patch('/set-is-read/:id')
  setIsReadTrue(@Param('id') roomId: string, @Req() req: any) {
    const { id: userId } = req.user;
    return this.chatRoomService.setIsReadTrue(roomId, userId);
  }

  @Post('/edit-group/:roomId')
  editGroup(@Param('roomId') roomId: string, @Body() body) {
    return this.chatRoomService.editGroup(roomId, body);
  }

  @Get('get-attachments/:roomId')
  getAttachment(@Param('roomId') roomId: string) {
    return this.chatRoomService.getAttachments(roomId);
  }

  @Delete('remove-file/:fileId/:roomId')
  removeFile(@Param('fileId') fileId: string, @Param('roomId') roomId: string) {
    return this.chatRoomService.removeFile(fileId, roomId);
  }
}
