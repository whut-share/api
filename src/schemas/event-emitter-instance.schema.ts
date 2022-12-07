import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, SchemaTypes, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema, NestedBaseClass } from './helpers';
import * as MnemonicWords from 'mnemonic-words';
import * as Crypto from 'crypto';

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

  public _id: ObjectId;

  @Field()
  public get id(): string {
    return String(this._id);
  };

  @Prop({ required: true })
  @Field()
  public name: string;

  @Prop({ required: true })
  @Field()
  public is_webhook_emitter: boolean;

  @Prop()
  @Field({ nullable: true })
  public webhook_endpoint?: string;

  @Prop({ required: true })
  @Field()
  public syncer_instance: string;

  @Prop({ default: false })
  @Field()
  public is_stopped: boolean;

  @Prop({ default: {}, type: SchemaTypes.Mixed })
  public metadata?: any;

  public generateName() {

    const first_word = MnemonicWords[Number((MnemonicWords.length * Math.random()).toFixed(0))];
    const second_word = MnemonicWords[Number((MnemonicWords.length * Math.random()).toFixed(0))];

    const hash = Math.random().toString(36).slice(2, 6);

    this.name = `${first_word}-${second_word}-${hash}`;
  }
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