import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';

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
export class ScanTarget extends BaseClass {

  @Prop({ required: true })
  public _id: string;

  public get id(): string {
    return this._id;
  };

  @Prop({ required: true })
  @Field()
  public address: string;

  @Prop({ required: true })
  @Field()
  public deploy_tx: string;

  @Prop({ required: true })
  @Field()
  public network: string;

  @Prop()
  @Field({ nullable: true })
  public project: string;

  @Prop({ default: false })
  @Field()
  public is_inner_usage: boolean;

  @Prop({ required: true })
  @Field()
  public contract_name: string;

  @Prop({ default: [], type: [String] })
  @Field(type => [String])
  public events: string[];

  @Prop({ default: {}, type: Object })
  public metadata?: any;
}

export const ScanTargetSchema = fixSchema(SchemaFactory.createForClass(ScanTarget), ScanTarget);

export const ScanTargetModelModule = MongooseModule.forFeatureAsync([
  {
    name: ScanTarget.name,
    imports: [

    ],
    useFactory: defaultUseFactory(ScanTargetSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);