import { FileManager } from '@/providers/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';

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

  @Prop()
  @Field(type => [String])
  public include_networks: string[];

  @Prop()
  @Field()
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

  @Prop()
  @Field(type => [String])
  public include_networks: string[];

  @Prop()
  @Field()
  public token_base_url: string;

  @Prop()
  @Field()
  public webhook_events_url: string;
}

export const ProjectDassetsDataSchema = fixSchema(SchemaFactory.createForClass(ProjectDassetsData), ProjectDassetsData);

@Schema({
  timestamps: true,
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

  public get id(): string {
    return this._id.toString();
  };

  @Prop({ required: true })
  public user: string;

  @Prop({ required: true })
  public name: string;
  
  @Prop()
  @Field({ nullable: true })
  public pic?: string;

  @Prop({ type: ProjectDassetsDataSchema })
  @Field({ nullable: true })
  public dassets?: ProjectDassetsData;

  @Prop({ type: ProjectSyncerData })
  @Field({ nullable: true })
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