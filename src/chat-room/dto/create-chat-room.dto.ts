import { ApiProperty } from "@nestjs/swagger";

export class CreateChatRoomDto {
    @ApiProperty({type: String, description: "content"})
    userId: string;
}
