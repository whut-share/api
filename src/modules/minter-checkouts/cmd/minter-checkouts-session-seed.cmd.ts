import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Project, TProjectDocument, User, TUserDocument } from '@/schemas';
import { Command, CommandRunner, Option } from 'nest-commander';
import { MinterCheckoutsService } from '../services/minter-checkouts.service';

interface BasicCommandOptions {
  project: string;
}

@Command({
  name: 'minter-checkouts:seed', 
  description: '...',
})
export class MinterCheckoutsSessionSeedCmd extends CommandRunner {

  constructor(
    private minter_checkouts_service: MinterCheckoutsService,

    @InjectModel(User.name)
    private user_model: Model<TUserDocument>,

    @InjectModel(Project.name)
    private project_model: Model<TProjectDocument>,
  ) { super() }

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ) {

    const project = await this.project_model.findOne({ _id: options.project });
    const user = await this.user_model.findOne({ _id: project.user });

    const session = await this.minter_checkouts_service.create(
      user,
      {
        project: options.project,
        asset_info: {
          id: '1',
          name: 'test',
          image_url: 'https://minter.io',
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