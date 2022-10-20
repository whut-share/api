import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Project, User } from '@/schemas';
import { Command, CommandRunner, Option } from 'nest-commander';

interface BasicCommandOptions {
  user: string;
}

@Command({
  name: 'projects:seed', 
  description: 'seed projects',
})
export class ProjectsSeedCmd extends CommandRunner {

  constructor(
    @InjectModel(Project.name)
    private project_model: Model<Project>,
  ) { super() }

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ) {

    await this.project_model.create({
      user: options.user,
      name: 'test',
      dassets: {
        include_networks: [ 'local' ],
        token_base_url: 'http://localhost:3000',
        webhook_events_url: 'http://localhost:3000',
      }
    });
    
  }


  @Option({
    flags: '-u, --user [ObjectId]',
    description: 'Owner user id',
    required: true,
  })
  user(val: string): string {
    return val;
  }
}