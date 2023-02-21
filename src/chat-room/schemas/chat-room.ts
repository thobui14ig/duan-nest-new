import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './../../users/schemas/users.schema';
import { Messages } from './messages';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({ autoCreate: true, collection: 'chats' })
export class ChatRoom {
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Messages', default: undefined })
  messages: Messages[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Users', default: undefined })
  users: User[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
