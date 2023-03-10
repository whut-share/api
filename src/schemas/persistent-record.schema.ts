import { AddressScalar } from '@/graphql/scalars';
import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, SchemaTypes, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';

export type PersistentRecordDocument = PersistentRecord & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  toObject: {
    virtuals: true,
    getters: true,
  },
  toJSON: {
    virtuals: true,
    getters: true,
  },
  minimize: false
})
export class PersistentRecord {

  @Prop({ required: true })
  _id: string;

  id: string;

  @Prop({ required: true, type: SchemaTypes.Mixed })
  value: any;

}

export const PersistentRecordSchema = fixSchema(SchemaFactory.createForClass(PersistentRecord), PersistentRecord);

export const PersistentRecordModelModule = MongooseModule.forFeatureAsync([
  {
    name: PersistentRecord.name,
    imports: [

    ],
    useFactory: defaultUseFactory(PersistentRecordSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);