import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';
import { SyncerInstance } from './syncer-instance.schema';
import { generateKeyPair } from 'crypto';

export type TKeyBunchDocument = KeyBunch & Document;

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
export class KeyBunch extends BaseClass {

  public _id: ObjectId;

  @Field()
  public get id(): string {
    return this._id.toString();
  };

  @Prop({ required: true })
  @Field()
  public user: string;

  @Prop({ required: true })
  @Field()
  public project: string;

  @Prop({ required: true })
  @Field()
  public name: string;
  
  @Prop({ default: '' })
  @Field()
  public description: string;

  @Prop({ required: true, index: true, unique: true })
  @Field()
  public public_key: string;

  @Prop({ required: true, select: false })
  @Field({ nullable: true })
  public secret_key: string;

  public async generateKeys() {

    const res: { publicKey: string, privateKey: string } = await new Promise((resolve, reject) => {
      generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: 'top secret'
        }
      }, (err, publicKey, privateKey) => {
        if(err) {
          reject(err);
        }

        resolve({ publicKey, privateKey });
      });
    })

    this.public_key = `pk_${res.publicKey}`;
    this.secret_key = `pk_${res.privateKey}`;
  }
}

export const KeyBunchSchema = fixSchema(SchemaFactory.createForClass(KeyBunch), KeyBunch);

export const KeyBunchModelModule = MongooseModule.forFeatureAsync([
  {
    name: KeyBunch.name,
    imports: [

    ],
    useFactory: defaultUseFactory(KeyBunchSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);