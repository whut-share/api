import { AddressScalar, ObjectIdScalar } from '@/graphql/scalars';
import { Keccak256Scalar } from '@/graphql/scalars/keccak256.scalar';
import { NetworkScalar } from '@/graphql/scalars/network.scalar';
import { FileManager } from '@/libs/file-manager';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { utils } from 'ethers';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';

export type TMinterNftDocument = MinterNft & Document;

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
export class MinterNft extends BaseClass {

  @Prop({ required: true })
  public _id: string;

  public id: string;

  @Prop({ required: true })
  @Field(type => ObjectIdScalar)
  public project: string;

  @Prop({ required: true, lowercase: true })
  @Field(type => AddressScalar)
  public owner: string;

  @Prop({ required: true })
  @Field(type => Keccak256Scalar)
  public mint_tx: string;

  @Prop({ required: true })
  @Field(type => Int)
  public mint_block: number;

  @Prop({ required: true })
  @Field(type => NetworkScalar)
  public network: string;

  @Prop({ required: true })
  @Field(type => Int)
  public token_id: number;

  @Prop({ required: true })
  @Field()
  public asset_id: string;

  @Prop({ required: true })
  @Field(type => Int)
  public owner_synced_at: number;

  static formatId(network: string, token_id: number): string {
    return utils.keccak256(utils.toUtf8Bytes(`${network}_${token_id}`));
  }

}

export const MinterNftSchema = fixSchema(SchemaFactory.createForClass(MinterNft), MinterNft);

export const MinterNftModelModule = MongooseModule.forFeatureAsync([
  {
    name: MinterNft.name,
    imports: [

    ],
    useFactory: defaultUseFactory(MinterNftSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);