import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@/schemas';
import { DassetsMinterService } from './services/dassets-minter.service';

@Controller('dassets')
export class DassetsController {

  constructor(
    private dassets_minter_service: DassetsMinterService,
  ) {}
  
  @Post('mint')
  async mint(
    @Body() body: any,
  ) {
    return await this.dassets_minter_service.mint('InteractERC1155', 'local', body.project_id);
  }
}