import { NetworkScalar } from '@/graphql/scalars/network.scalar';
import { FileManager } from '@/libs/file-manager';
import { Field, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mixed, ObjectId, Types } from 'mongoose';
import { BaseClass, defaultUseFactory, fixSchema } from './helpers';
import { SyncerInstance } from './syncer-instance.schema';

export type TProjectDocument = Project & Document;

@Schema({
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
export class ProjectSyncerSettings {

  @Prop({ default: [] })
  @Field(type => [NetworkScalar])
  public include_networks: string[];

  @Prop()
  @Field({ nullable: true })
  public contracts_base_url: string;
}

export const ProjectSyncerSettingsSchema = fixSchema(SchemaFactory.createForClass(ProjectSyncerSettings), ProjectSyncerSettings);

@Schema({
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
export class ProjectMinterSettings {

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

export const ProjectMinterSettingsSchema = fixSchema(SchemaFactory.createForClass(ProjectMinterSettings), ProjectMinterSettings);

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

  @Prop({ type: ProjectMinterSettingsSchema, default: () => new ProjectMinterSettings() })
  @Field()
  public minter_settings?: ProjectMinterSettings;

  @Prop({ type: ProjectSyncerSettings, default: () => new ProjectSyncerSettings() })
  @Field()
  public syncer_settings?: ProjectSyncerSettings;

  // public get fullName() {
  //   return `${this.firstName} ${this.lastName}`;
  // }

  @Field(type => SyncerInstance)
  public minter_syncer_instance: SyncerInstance;
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