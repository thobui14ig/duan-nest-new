import { Attachment } from './../../tasks/schemas/attachment';
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

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'attachments',
    default: undefined,
  })
  attachments: Attachment[];

  @Prop({
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'user',
        },
        isRead: { type: Boolean, default: false },
      },
    ],
    required: true,
    default: [],
  })
  read: { user: string; isRead: boolean }[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
