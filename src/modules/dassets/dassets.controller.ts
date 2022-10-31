import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User, UserDocument } from '@/schemas';
import { DassetsMinterService } from './services/dassets-minter.service';
import { DassetsSessionService } from './services/dassets-session.service';
import { AuthGuard } from '@/guards';
import { UserParam } from '@/decorators';
import { IDassetsSessionUpdate } from './interfaces/dassets-session-update.interface';
import { IDassetsSessionCreate } from './interfaces/dassets-session-create.interface';

@Controller('dassets')
@UsePipes(new ValidationPipe({ transform: true }))
export class DassetsController {

  constructor(
    private dassets_minter_service: DassetsMinterService,
    private dassets_session_service: DassetsSessionService,
  ) {}
  
  @Post('mint')
  async mint(
    @Body() body: any,
  ) {
    return await this.dassets_minter_service.mint('InteractERC1155', 'local', body.project_id);
  }

  @Post('session/:session/stripe-pi')
  async createStripePaymentIntent(
    @Param('session') session_id: string,
    @Body() body: any,
  ) {
    const session = await this.dassets_session_service.getOrFail(session_id);
    return await this.dassets_session_service.createStripePaymentIntent(session);
  }

  @Post('session')
  @UseGuards(AuthGuard)
  async createSession(
    @UserParam() user: UserDocument,
    @Body() body: IDassetsSessionCreate,
  ) {
    return await this.dassets_session_service.create(user, body);
  }


  @Get('session/:session')
  async getSession(
    @Param('session') session_id: string,
  ) {
    return await this.dassets_session_service.getOrFail(session_id);
  }


  @Get('session/:session/estimate')
  async estimateSession(
    @Param('session') session_id: string,
  ) {
    const session = await this.dassets_session_service.getOrFail(session_id);
    return await this.dassets_session_service.estimatePrice(session);
  }


  @Put('session/:session')
  async updateSession(
    @Param('session') session_id: string,
    @Body() body: IDassetsSessionUpdate,
  ) {
    const session = await this.dassets_session_service.getOrFail(session_id);
    return await this.dassets_session_service.update(session, body);
  }

  @Delete('session/:session')
  async deleteSession(
    @Param('session') session_id: string,
  ) {
    const session = await this.dassets_session_service.getOrFail(session_id);
    await this.dassets_session_service.delete(session);
  }
}