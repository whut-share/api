import { AddressScalar } from '@/graphql/scalars';
import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { utils } from 'ethers';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  },
  minimize: false
})
@ObjectType()
export class DassetsNft extends BaseClass {

  @Prop({ required: true })
  _id: string;

  id: string;

  @Prop({ required: true })
  @Field()
  project: string;

  @Prop({ required: true })
  @Field(type => AddressScalar)
  owner: string;

  @Prop({ required: true })
  @Field()
  mint_tx: string;

  @Prop({ required: true })
  @Field()
  network: string;

  @Prop({ required: true })
  @Field()
  token_id: number;

  @Prop()
  @Field({ nullable: true })
  client_token_id?: string;

  @Prop({ required: true })
  @Field()
  owner_synced_at: number;

  static formatId(network: string, token_id: number): string {
    return utils.keccak256(utils.toUtf8Bytes(`${network}_${token_id}`));
  }

}

export const DassetsNftSchema = SchemaFactory.createForClass(DassetsNft);

export const DassetsNftModelModule = MongooseModule.forFeatureAsync([
  {
    name: DassetsNft.name,
    imports: [

    ],
    useFactory: defaultUseFactory(DassetsNftSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);