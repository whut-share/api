import { FileManager } from '@/providers/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';

export type WebhookDocument = Webhook & Document;

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
@ObjectType()
export class Webhook extends BaseClass {

  public _id: ObjectId;

  public get id(): string {
    return this._id.toString();
  }

  @Prop({ required: true })
  @Field()
  public project: string;

  @Prop({ default: 0 })
  @Field()
  public attempt: number;

  @Prop({ required: true })
  @Field()
  public url: string;

  @Prop({ required: true })
  @Field()
  public idempotency_key: string;

  @Prop({ required: true, type: Object })
  @Field()
  public data: any;

  @Prop({ type: Object })
  public response_body?: any;

  @Prop({ default: {}, type: Object })
  public metadata?: any;

}

export const WebhookSchema = SchemaFactory.createForClass(Webhook);

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