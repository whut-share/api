import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { DassetsCheckoutsService } from './services/dassets-checkouts.service';

@Controller('dassets-checkouts')
@UsePipes(new ValidationPipe({ transform: true }))
export class DassetsCheckoutsController {

  constructor(
    private dassets_checkouts_service: DassetsCheckoutsService,
  ) {}
  
  @Post(':session/stripe-pi')
  async createStripePaymentIntent(
    @Param('session') session: string,
  ) {
    const d_session = await this.dassets_checkouts_service.getOrFail(session);
    return await this.dassets_checkouts_service.createStripePaymentIntent(d_session);
  }
}