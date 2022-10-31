import { AddressScalar } from '@/graphql/scalars';
import { FileManager } from '@/providers/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';

export type DassetFlowSessionDocument = DassetFlowSession & Document;

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
export class DassetFlowSession extends BaseClass {

  public _id: ObjectId;

  @Field()
  public get id(): string {
    return this._id.toString();
  };

  @Prop({ required: true })
  @Field()
  public project: string;

  @Prop()
  @Field()
  public address: string;

  @Prop({ required: true })
  @Field()
  public mint_tx: string;

  @Prop({ required: true })
  @Field()
  public network: string;

  @Prop({ required: true })
  @Field()
  public token_id: number;

  @Prop({ required: true })
  @Field()
  public contract_type: string;

  @Field()
  public get url(): string {
    return `${process.env['DASSET_FLOW_URL']}/${this.id}`
  };

}

export const DassetFlowSessionSchema = SchemaFactory.createForClass(DassetFlowSession);

export const DassetFlowSessionModelModule = MongooseModule.forFeatureAsync([
  {
    name: DassetFlowSession.name,
    imports: [

    ],
    useFactory: defaultUseFactory(DassetFlowSessionSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);
