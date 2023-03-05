import { ApiProperty } from '@nestjs/swagger';

export class CreateChatGroupDto {
  @ApiProperty({ type: String, description: 'groupName' })
  groupName: string;

  @ApiProperty({ type: String, description: 'listUsers' })
  users: string[];

  @ApiProperty({ type: String, description: 'listUsers' })
  createBy: string;

  @ApiProperty({ type: String, description: 'listUsers' })
  read: any;
}
