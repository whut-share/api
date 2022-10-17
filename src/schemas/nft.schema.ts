import { FileManager } from '@/providers/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';

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
export class Nft extends BaseClass {

  @Prop({ required: true })
  @Field()
  user: string;

  @Prop({ required: true })
  @Field()
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

  @Prop({ required: true })
  @Field()
  local_token_id: string;

  @Prop({ required: true })
  @Field()
  owner_synced_at: number;

}

export const NftSchema = SchemaFactory.createForClass(Nft);

export const NftModelModule = MongooseModule.forFeatureAsync([
  {
    name: Nft.name,
    imports: [

    ],
    useFactory: defaultUseFactory(NftSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);