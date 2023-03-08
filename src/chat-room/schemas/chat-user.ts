import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChatUserDocument = HydratedDocument<ChatUser>;

@Schema({
  autoCreate: true,
  collection: 'chatuser',
  timestamps: true,
  versionKey: false,
})
export class ChatUser {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'chats',
  })
  roomId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  })
  userId: string;

  @Prop({
    type: Boolean,
    required: true,
  })
  isRead: boolean;
}

export const ChatUserSchema = SchemaFactory.createForClass(ChatUser);
