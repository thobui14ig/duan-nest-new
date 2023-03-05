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
    ref: 'Users',
  })
  user: string;

  @Prop({
    type: [
      {
        roomId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'chats',
        },
        isRead: { type: Boolean, default: false },
      },
    ],
    required: true,
    default: [],
  })
  rooms: { roomId: string; isRead: boolean }[];
}

export const ChatUserSchema = SchemaFactory.createForClass(ChatUser);
