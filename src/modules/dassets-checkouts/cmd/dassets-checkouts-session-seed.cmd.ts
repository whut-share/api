import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Project, ProjectDocument, User, UserDocument } from '@/schemas';
import { Command, CommandRunner, Option } from 'nest-commander';
import { DassetsCheckoutsService } from '../services/dassets-checkouts.service';

interface BasicCommandOptions {
  project: string;
}

@Command({
  name: 'dassets-checkouts:seed', 
  description: '...',
})
export class DassetsCheckoutsSessionSeedCmd extends CommandRunner {

  constructor(
    private dassets_checkouts_service: DassetsCheckoutsService,

    @InjectModel(User.name)
    private user_model: Model<UserDocument>,

    @InjectModel(Project.name)
    private project_model: Model<ProjectDocument>,
  ) { super() }

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ) {

    const project = await this.project_model.findOne({ _id: options.project });
    const user = await this.user_model.findOne({ _id: project.user });

    const session = await this.dassets_checkouts_service.create(
      user,
      {
        project: options.project,
        asset_info: {
          id: '1',
          name: 'test',
          image_url: 'https://dassets.io',
        },
      },
    );

    console.log('Session seeded.', session);
    
  }


  @Option({
    flags: '--project [string]',
    description: '...',
    required: true,
  })
  project(val: string): string {
    return val;
  }
}