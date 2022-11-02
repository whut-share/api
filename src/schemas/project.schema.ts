import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';

export type ProjectDocument = Project & Document;

@Schema({
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  },
  minimize: false
})
@ObjectType()
export class ProjectSyncerData {

  @Prop({ default: [] })
  @Field(type => [String])
  public include_networks: string[];

  @Prop()
  @Field({ nullable: true })
  public contracts_base_url: string;
}

export const ProjectSyncerDataSchema = fixSchema(SchemaFactory.createForClass(ProjectSyncerData), ProjectSyncerData);

@Schema({
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  },
  minimize: false
})
@ObjectType()
export class ProjectDassetsData {

  @Prop({ default: [] })
  @Field(type => [String])
  public include_networks: string[];

  @Prop()
  @Field({ nullable: true })
  public token_base_url: string;

  @Prop()
  @Field({ nullable: true })
  public webhook_events_url: string;
}

export const ProjectDassetsDataSchema = fixSchema(SchemaFactory.createForClass(ProjectDassetsData), ProjectDassetsData);

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
  minimize: false,
  id: false,
})
@ObjectType()
export class Project extends BaseClass {

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

  @Prop({ type: ProjectDassetsDataSchema, default: () => new ProjectDassetsData() })
  @Field()
  public dassets?: ProjectDassetsData;

  @Prop({ type: ProjectSyncerData, default: () => new ProjectSyncerData() })
  @Field()
  public syncer?: ProjectSyncerData;

  // public get fullName() {
  //   return `${this.firstName} ${this.lastName}`;
  // }
}

export const ProjectSchema = fixSchema(SchemaFactory.createForClass(Project), Project);

export const ProjectModelModule = MongooseModule.forFeatureAsync([
  {
    name: Project.name,
    imports: [

    ],
    useFactory: defaultUseFactory(ProjectSchema),
    inject: [
      FileManager, 
      // getModelToken(Character.name)
    ],
  }
]);