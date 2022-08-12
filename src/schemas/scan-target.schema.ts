import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  },
  minimize: false
})
export class User {
  @Prop()
  email: string;

  // public get fullName() {
  //   return `${this.firstName} ${this.lastName}`;
  // }
}

export const UserSchema = SchemaFactory.createForClass(User);