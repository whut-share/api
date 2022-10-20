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
export class DassetNft extends BaseClass {

  @Prop({ required: true })
  _id: string;

  id: string;

  @Prop({ required: true })
  @Field()
  project: string;

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

  @Prop()
  @Field({ nullable: true })
  client_token_id?: string;

  @Prop({ required: true })
  @Field()
  owner_synced_at: number;

}

export const DassetNftSchema = SchemaFactory.createForClass(DassetNft);

export const DassetNftModelModule = MongooseModule.forFeatureAsync([
  {
    name: DassetNft.name,
    imports: [

    ],
    useFactory: defaultUseFactory(DassetNftSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);