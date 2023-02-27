import { AuthGuard } from './../auth/guard/auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatRoomService.remove(+id);
  }
}
