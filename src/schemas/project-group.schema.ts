import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';
import { SyncerInstance } from './syncer-instance.schema';

export type TProjectGroupDocument = ProjectGroup & Document;

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
export class ProjectGroup extends BaseClass {

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
  public name: string;
  
  @Prop()
  @Field({ nullable: true })
  public pic?: string;


  @Prop({ default: [], type: [String] })
  @Field(type => [String])
  public projects: string[];
}

export const ProjectGroupSchema = fixSchema(SchemaFactory.createForClass(ProjectGroup), ProjectGroup);

export const ProjectGroupModelModule = MongooseModule.forFeatureAsync([
  {
    name: ProjectGroup.name,
    imports: [

    ],
    useFactory: defaultUseFactory(ProjectGroupSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);