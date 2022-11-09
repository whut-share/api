import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';
import GraphQLJSON from 'graphql-type-json';

export type WebhookEndpointDocument = WebhookEndpoint & Document;

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
export class WebhookEndpoint extends BaseClass {

  public _id: ObjectId;

  @Field()
  public get id(): string {
    return this._id.toString();
  }

  @Prop({ required: true })
  @Field()
  public project: string;

  @Prop({ required: true })
  @Field()
  public url: string;

  @Prop({ required: true })
  @Field()
  public key: string;

  @Prop({ default: {}, type: Object })
  public metadata?: any;

}

export const WebhookEndpointSchema = fixSchema(SchemaFactory.createForClass(WebhookEndpoint), WebhookEndpoint);

export const WebhookEndpointModelModule = MongooseModule.forFeatureAsync([
  {
    name: WebhookEndpoint.name,
    imports: [

    ],
    useFactory: defaultUseFactory(WebhookEndpointSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);