import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MessagesDocument = HydratedDocument<Messages>;

@Schema({ autoCreate: true, collection: 'messages' })
export class Messages {
  @Prop({ type: String, default: undefined })
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  })
  createdBy: string;

  //   @Prop()
  //   room: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Chatrooms'}
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);
