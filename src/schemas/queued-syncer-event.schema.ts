import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, SchemaTypes, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema, NestedBaseClass } from './helpers';
import GraphQLJSON from 'graphql-type-json';
import { SyncerEvent } from './syncer-event.schema';

export type TQueuedSyncerEventDocument = QueuedSyncerEvent & Document;

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
  minimize: false,
  id: false,
})
@ObjectType()
export class QueuedSyncerEvent extends SyncerEvent {

  @Field()
  public get is_processed(): boolean {
    return false;
  }
}

export const QueuedSyncerEventSchema = fixSchema(SchemaFactory.createForClass(QueuedSyncerEvent), QueuedSyncerEvent);

export const QueuedSyncerEventModelModule = MongooseModule.forFeatureAsync([
  {
    name: QueuedSyncerEvent.name,
    imports: [

    ],
    useFactory: defaultUseFactory(QueuedSyncerEventSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);