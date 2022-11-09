import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';
import * as Crypto from 'crypto';
import * as Jwt from 'jsonwebtoken';
import { FileManager } from '@/libs/file-manager';
import { ObjectIdScalar } from '@/graphql/scalars';
import { Field, ObjectType } from '@nestjs/graphql';

export type UserDocument = User & Document;

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
export class User extends BaseClass {

  @Field(type => ObjectIdScalar)
  public id?: string;

  @Prop({ required: true })
  @Field()
  public email: string;

  @Prop()
  private salt?: string;

  @Prop()
  private hash?: string;

  public generateJWT() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 1);
  
    return Jwt.sign({
      id: this.id,
      // exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env['ACCESS_TOKEN_SECRET']);
  }

  public validatePassword(password: string): boolean {
    const hash = Crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
  }

  public setPassword(password: string): void {
    this.salt = Crypto.randomBytes(16).toString('hex');
    this.hash = Crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  }

  // public get fullName() {
  //   return `${this.firstName} ${this.lastName}`;
  // }
}

export const UserSchema = fixSchema(SchemaFactory.createForClass(User), User);


export const UserModelModule = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    imports: [

    ],
    useFactory: defaultUseFactory(UserSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);