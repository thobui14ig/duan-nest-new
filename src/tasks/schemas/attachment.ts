import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AttachmentDocument = HydratedDocument<Attachment>;

@Schema({
  autoCreate: true,
  collection: 'attachments',
  timestamps: true,
  versionKey: false,
})
export class Attachment {
  @Prop({ type: String, default: undefined })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  })
  createdBy: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tasks',
  })
  task: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
