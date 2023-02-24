import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({ type: String, description: 'content' })
  content: string;

  @ApiProperty({ type: String, description: 'roomId' })
  roomId: string;

  @ApiProperty({ type: String, description: 'receiveId' })
  receiveId: string;
}
