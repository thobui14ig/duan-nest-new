import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './../../users/schemas/users.schema';
import { Messages } from './messages';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({
  autoCreate: true,
  collection: 'chats',
  timestamps: true,
  versionKey: false,
})
export class ChatRoom {
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'messages',
    default: undefined,
  })
  messages: string[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'users',
    default: undefined,
  })
  users: User[];

  @Prop({
    type: String,
    required: true,
    default: 'user',
  })
  type: string;

  @Prop({
    type: String,
    default: undefined,
  })
  name: string;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
