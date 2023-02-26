import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TasksDocument = HydratedDocument<Tasks>;

@Schema({
  autoCreate: true,
  collection: 'tasks',
  timestamps: true,
  versionKey: false,
})
export class Tasks {
  @Prop({ type: String, default: undefined })
  title: string;

  @Prop({ type: String, default: undefined })
  description: string;

  @Prop({ type: Date, default: undefined })
  startDay: Date;

  @Prop({ type: Date, default: undefined })
  endDay: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  })
  assigne: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  })
  createdBy: string;
}

export const TasksSchema = SchemaFactory.createForClass(Tasks);
