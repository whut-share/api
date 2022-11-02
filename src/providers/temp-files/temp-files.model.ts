import { getModelToken, MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Document, Mixed, Model, ObjectId, Types } from 'mongoose';
import { ObjectIdScalar, AddressScalar } from '@/graphql/scalars';
import { FileManager } from '@/libs/file-manager';
import { Inject, Module } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid'

import * as Crypto from 'crypto';
import { BaseClass, defaultUseFactory, fixSchema } from '@/schemas/helpers';

@Schema({
  timestamps: true,
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
export class TempFile extends BaseClass {

  public id?: string;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public path: string;

  @Prop()
  public user: string;

  @Prop({ default: {}, type: Object })
  public metadata?: any;

  public get url() {
    const fm = this.getDep<FileManager>(FileManager);
    return fm.url(this.path);
  }

  public async cp(path: string, prefix: string = '', name: string = '') {
    const fm = this.getDep<FileManager>(FileManager);
    const ext = this.name.split('.')[this.name.split('.').length - 1];
  
    if(!name) {
      name = Crypto.randomBytes(20).toString('hex');
    }
  
    path = path.replace(/^\/|\/$/g, '');
    path = path + '/' + prefix + name + '.' + ext;
  
    const content = await fm.get(this.path);
    await fm.put(path, content);
  
    return path;
  }

  public static async upload(
    fm: FileManager, 
    user: string, 
    path: string, 
    orig_name: string, 
    meta: any = {}
  ): Promise<TempFile> {
    const new_path = 'tmp/' + uuidv4();

    await fm.putFile(new_path, path);

    return await this.model.create({
      name: orig_name,
      meta: meta,
      user: user,
      path: new_path,
    });
  }

  // public static async findOneOrFail(fm: FileManager, id: string): Promise<TempFile> {
  //   const new_path = 'tmp/' + uuidv4();

  //   await fm.putFile(new_path, path);

  //   const tf = await this.model.findOne({
  //     name: orig_name,
  //     meta: meta,
  //     user: user._id,
  //     path: new_path,
  //   });

  //   if() {

  //   }
  // }
}

export const TempFileSchema = fixSchema(SchemaFactory.createForClass(TempFile), TempFile);

export const TempFileModelModule = MongooseModule.forFeatureAsync([
  {
    name: TempFile.name,
    imports: [
      
    ],
    useFactory: defaultUseFactory(TempFileSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);