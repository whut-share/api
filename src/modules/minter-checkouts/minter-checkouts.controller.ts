import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MinterCheckoutsService } from './services/minter-checkouts.service';

@Controller('minter-checkouts')
@UsePipes(new ValidationPipe({ transform: true }))
export class MinterCheckoutsController {

  constructor(
    private minter_checkouts_service: MinterCheckoutsService,
  ) {}
}