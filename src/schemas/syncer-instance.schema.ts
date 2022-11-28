import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, SchemaTypes, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema, NestedBaseClass } from './helpers';
import GraphQLJSON from 'graphql-type-json';
import { ObjectIdScalar } from '@/graphql/scalars';
import { networks_list } from '@/providers/networks/networks-list';

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
})
@ObjectType()
export class SyncerInstanceContract extends NestedBaseClass {

  public id?: string;

  @Prop({ required: true, enum: networks_list.map(e => e.key) })
  @Field()
  public network: string;

  @Prop({ required: true, lowercase: true })
  @Field()
  public address: string;

  @Prop({ required: true, lowercase: true })
  @Field()
  public deploy_tx: string;

  @Prop({ required: true })
  @Field()
  public contract_name: string;

  @Prop({ default: [ '*' ], type: [String] })
  @Field(type => [String])
  public events?: string[];

  @Prop({ required: true, type: SchemaTypes.Mixed })
  @Field(type => GraphQLJSON)
  public abi: any;
}

export const SyncerInstanceContractSchema = SchemaFactory.createForClass(SyncerInstanceContract);

export type TSyncerInstanceDocument = SyncerInstance & Document;

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
})
@ObjectType()
export class SyncerInstance extends BaseClass {

  @Field(type => ObjectIdScalar)
  public id?: string;

  @Prop({ type: [SyncerInstanceContractSchema], default: [] })
  @Field(type => [SyncerInstanceContract])
  public contracts: SyncerInstanceContract[];

  @Prop()
  @Field(type => ObjectIdScalar)
  public project: string;

  @Prop({ enum: [ 'custom', 'dassets' ], default: 'custom' })
  @Field()
  public preset?: 'custom' | 'dassets' = 'custom';

  @Prop({ default: {}, type: SchemaTypes.Mixed })
  public metadata?: any;
}

export const SyncerInstanceSchema = fixSchema(SchemaFactory.createForClass(SyncerInstance), SyncerInstance);

export const SyncerInstanceModelModule = MongooseModule.forFeatureAsync([
  {
    name: SyncerInstance.name,
    imports: [

    ],
    useFactory: defaultUseFactory(SyncerInstanceSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);