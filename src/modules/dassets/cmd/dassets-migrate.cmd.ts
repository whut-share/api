import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User } from '@/schemas';
import { Command, CommandRunner, Option } from 'nest-commander';
import { DassetsMigratorService } from '../services/dassets-migrator.service';

interface BasicCommandOptions {
  number: number;
}

@Command({
  name: 'dassets:migrate', 
  description: 'migrate dassets contracts and sove output',
})
export class DassetsMigrateCmd extends CommandRunner {

  constructor(
    private dassets_migrator_service: DassetsMigratorService,
  ) { super() }

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ) {

    await this.dassets_migrator_service.migrate();
    
  }
}