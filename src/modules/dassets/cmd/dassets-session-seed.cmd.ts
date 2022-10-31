import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument } from '@/schemas';
import { Command, CommandRunner, Option } from 'nest-commander';
import { DassetsMigratorService } from '../services/dassets-migrator.service';
import { DassetsMinterService } from '../services/dassets-minter.service';
import { DassetsSessionService } from '../services/dassets-session.service';

interface BasicCommandOptions {
  project: string;
}

@Command({
  name: 'dassets:session-seed', 
  description: '...',
})
export class DassetsSessionSeedCmd extends CommandRunner {

  constructor(
    private dassets_session_service: DassetsSessionService,

    @InjectModel(User.name)
    private user_model: Model<UserDocument>,
  ) { super() }

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ) {

    const session = await this.dassets_session_service.create(
      await this.user_model.findOne(),
      {
        project_id: options.project,
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