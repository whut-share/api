import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User } from '@/schemas';
import { Command, CommandRunner, Option } from 'nest-commander';
import { MinterMigratorService } from '../services/minter-migrator.service';

interface BasicCommandOptions {
  number: number;
}

@Command({
  name: 'minter:migrate', 
  description: 'migrate minter contracts and save output',
})
export class MinterMigrateCmd extends CommandRunner {

  constructor(
    private minter_migrator_service: MinterMigratorService,
  ) { super() }

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ) {

    await this.minter_migrator_service.migrate();
    
  }
}