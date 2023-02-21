import { ApiProperty } from "@nestjs/swagger";

export class AuthLoginDto{
    @ApiProperty({type: String, description: "name"})
    name: string;

    @ApiProperty({type: String, description: "password", default:""})
    password: string
}

