import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@Controller('chat-room')
@ApiTags('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Get('/create-room/:userId')
  createRoom(@Param() params: CreateChatRoomDto) {
    const { userId } = params;
    return this.chatRoomService.createRoom(userId);
  }

  @Get()
  findAll() {
    return this.chatRoomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatRoomService.findOne(+id);
  }

  @Patch(':id')
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
