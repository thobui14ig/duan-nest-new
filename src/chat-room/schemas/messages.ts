import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessagesDocument = HydratedDocument<Messages>;

@Schema()
export class Messages {
  @Prop({ type: String, default: undefined })
  content: string;

  //   @Prop()
  //   createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users'}

  //   @Prop()
  //   room: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Chatrooms'}
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);
