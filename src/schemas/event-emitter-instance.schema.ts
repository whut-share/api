import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, SchemaTypes, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema, NestedBaseClass } from './helpers';

export type TEventEmitterInstanceDocument = EventEmitterInstance & Document;

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
export class EventEmitterInstance extends BaseClass {

  @Prop({ required: true })
  public _id: string;

  public get id(): string {
    return this._id;
  };

  @Prop({ required: true })
  @Field()
  public is_webhook_emitter: boolean;

  @Prop()
  @Field({ nullable: true })
  public webhook_endpoint?: string;

  @Prop({ required: true })
  @Field()
  public project: string;

  @Prop({ required: true })
  @Field()
  public syncer_instance: string;

  @Prop({ default: {}, type: SchemaTypes.Mixed })
  public metadata?: any;
}

export const EventEmitterInstanceSchema = fixSchema(SchemaFactory.createForClass(EventEmitterInstance), EventEmitterInstance);

export const EventEmitterInstanceModelModule = MongooseModule.forFeatureAsync([
  {
    name: EventEmitterInstance.name,
    imports: [

    ],
    useFactory: defaultUseFactory(EventEmitterInstanceSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);