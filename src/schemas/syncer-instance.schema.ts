import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, SchemaTypes, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema, NestedBaseClass } from './helpers';
import GraphQLJSON from 'graphql-type-json';
import { AddressScalar, ObjectIdScalar } from '@/graphql/scalars';
import { chain_networks_list } from '@/providers/chain-networks';
import { Keccak256Scalar } from '@/graphql/scalars/keccak256.scalar';
import { NetworkScalar } from '@/graphql/scalars/network.scalar';

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

  @Prop({ required: true, enum: chain_networks_list.map(e => e.id) })
  @Field(type => NetworkScalar)
  public network: string;

  @Prop({ required: true, lowercase: true })
  @Field(type => AddressScalar)
  public address: string;

  @Prop({ required: true, lowercase: true })
  @Field(type => Keccak256Scalar)
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

  @Prop({ enum: [ 'custom', 'minter' ], default: 'custom' })
  @Field()
  public preset?: 'custom' | 'minter' = 'custom';

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