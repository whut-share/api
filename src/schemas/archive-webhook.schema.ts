import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';
import { Webhook } from './webhook.schema';

export type ArchiveWebhookDocument = ArchiveWebhook & Document;

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
@ObjectType()
export class ArchiveWebhook extends Webhook {

}

export const ArchiveWebhookSchema = fixSchema(SchemaFactory.createForClass(ArchiveWebhook), ArchiveWebhook);

export const ArchiveWebhookModelModule = MongooseModule.forFeatureAsync([
  {
    name: ArchiveWebhook.name,
    imports: [

    ],
    useFactory: defaultUseFactory(ArchiveWebhookSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);