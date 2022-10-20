import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User } from '@/schemas';
import { Command, CommandRunner, Option } from 'nest-commander';
import { DassetsMigratorService } from '../services/dassets-migrator.service';
import { DassetsMinterService } from '../services/dassets-minter.service';

interface BasicCommandOptions {
  network: string;
  contract: string;
  project: string;
}

@Command({
  name: 'dassets:mint', 
  description: 'mints some test nft',
})
export class DassetsMintCmd extends CommandRunner {

  constructor(
    private dassets_minter_service: DassetsMinterService,
  ) { super() }

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ) {

    await this.dassets_minter_service.mint(options.contract, options.network, options.project);
    
  }


  @Option({
    flags: '--contract [string]',
    description: 'Contract name to execute',
    required: true,
  })
  contract(val: string): string {
    return val;
  }


  @Option({
    flags: '--network [string]',
    description: 'Network name',
    required: true,
  })
  network(val: string): string {
    return val;
  }

  @Option({
    flags: '--project [ObjectId]',
    description: 'Project id',
    required: true,
  })
  project(val: string): string {
    return val;
  }
}