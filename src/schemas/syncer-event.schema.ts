import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, SchemaTypes, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema, NestedBaseClass } from './helpers';
import GraphQLJSON from 'graphql-type-json';
import { ObjectIdScalar } from '@/graphql/scalars';

export type TSyncerEventDocument = SyncerEvent & Document;

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
export class SyncerEvent extends BaseClass {

  public _id: ObjectId;

  @Prop({ required: true })
  @Field()
  public id?: string;

  @Field()
  public get internal_id(): string {
    return String(this._id);
  }

  @Prop({ required: true })
  @Field()
  public name: string;

  @Prop({ type: SchemaTypes.Mixed })
  @Field(type => GraphQLJSON, { nullable: true })
  public payload?: string;

  @Prop({ type: SchemaTypes.Mixed })
  @Field(type => GraphQLJSON, { nullable: true })
  public args?: any;

  @Prop({ required: true })
  @Field(type => ObjectIdScalar)
  public event_emitter_instance: string;

  @Prop({ default: {}, type: SchemaTypes.Mixed })
  @Field(type => GraphQLJSON)
  public metadata?: any;

  @Field()
  public get is_processed(): boolean {
    return true;
  }
}

export const SyncerEventSchema = fixSchema(SchemaFactory.createForClass(SyncerEvent), SyncerEvent);

export const SyncerEventModelModule = MongooseModule.forFeatureAsync([
  {
    name: SyncerEvent.name,
    imports: [

    ],
    useFactory: defaultUseFactory(SyncerEventSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);