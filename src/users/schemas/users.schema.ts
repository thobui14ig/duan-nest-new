import { ChatRoom } from './../../chat-room/schemas/chat-room';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema({
  autoCreate: true,
  collection: 'users',
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'chats',
    default: undefined,
  })
  listChats: ChatRoom[];
}

export const UserSchema = SchemaFactory.createForClass(User);
