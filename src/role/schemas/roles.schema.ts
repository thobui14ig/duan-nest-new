import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RolesDocument = HydratedDocument<Roles>;

@Schema({
  autoCreate: true,
  collection: 'roles',
  timestamps: true,
  versionKey: false,
})
export class Roles {
  @Prop({
    type: Boolean,
    required: true,
  })
  cUser: boolean;

  @Prop({
    type: Boolean,
    required: true,
  })
  uUser: boolean;

  @Prop({
    type: Boolean,
    required: true,
  })
  dUser: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  })
  userId: string;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
