import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User } from '@/schemas';
import { Command, CommandRunner, Option } from 'nest-commander';
import { MinterMigratorService } from '../services/minter-migrator.service';
import { MinterMinterService } from '../services/minter-minter.service';

interface BasicCommandOptions {
  network: string;
  contract: string;
  project: string;
}

@Command({
  name: 'minter:mint', 
  description: 'mints some test nft',
})
export class MinterMintCmd extends CommandRunner {

  constructor(
    private minter_minter_service: MinterMinterService,
  ) { super() }

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ) {

    await this.minter_minter_service.mint(options.contract, options.network, options.project);
    
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