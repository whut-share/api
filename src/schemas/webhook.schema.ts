import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, SchemaTypes, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';
import GraphQLJSON from 'graphql-type-json';
import { SyncerEvent, SyncerEventSchema } from './syncer-event.schema';

export type TWebhookDocument = Webhook & Document;

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
export class Webhook extends BaseClass {

  public _id: ObjectId;

  public get id(): string {
    return String(this._id);
  }

  @Prop({ required: true })
  @Field()
  public event_emitter_instance: string;

  @Prop({ default: 0 })
  @Field()
  public attempt: number;

  @Prop({ required: true })
  @Field()
  public url: string;

  @Prop({ required: true, type: SyncerEventSchema })
  @Field(type => SyncerEvent)
  public event: SyncerEvent;

  @Prop({ type: SchemaTypes.Mixed })
  public response_body?: any;

  @Prop({ default: {}, type: SchemaTypes.Mixed })
  public metadata?: any;

}

export const WebhookSchema = fixSchema(SchemaFactory.createForClass(Webhook), Webhook);

export const WebhookModelModule = MongooseModule.forFeatureAsync([
  {
    name: Webhook.name,
    imports: [

    ],
    useFactory: defaultUseFactory(WebhookSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);