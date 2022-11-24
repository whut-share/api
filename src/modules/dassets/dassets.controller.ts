import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User, TUserDocument } from '@/schemas';
import { DassetsMinterService } from './services/dassets-minter.service';
import { AuthGuard } from '@/guards';
import { UserParam } from '@/decorators';

@Controller('dassets')
@UsePipes(new ValidationPipe({ transform: true }))
export class DassetsController {

  constructor(
    private dassets_minter_service: DassetsMinterService,
  ) {}
  
  @Post('mint')
  async mint(
    @Body() body: any,
  ) {
    return await this.dassets_minter_service.mint('Dassets', 'local', body.project_id);
  }
}