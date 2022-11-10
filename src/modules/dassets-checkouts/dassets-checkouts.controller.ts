import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { DassetsCheckoutsService } from './services/dassets-checkouts.service';

@Controller('dassets-checkouts')
@UsePipes(new ValidationPipe({ transform: true }))
export class DassetsCheckoutsController {

  constructor(
    private dassets_checkouts_service: DassetsCheckoutsService,
  ) {}
}