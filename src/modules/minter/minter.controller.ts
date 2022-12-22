import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User, TUserDocument } from '@/schemas';
import { MinterMinterService } from './services/minter-minter.service';
import { AuthGuard } from '@/guards';
import { UserParam } from '@/decorators';

@Controller('minter')
@UsePipes(new ValidationPipe({ transform: true }))
export class MinterController {

  constructor(
    private minter_minter_service: MinterMinterService,
  ) {}
  
  @Post('mint')
  async mint(
    @Body() body: any,
  ) {
    return await this.minter_minter_service.mint('Minter', 'local', body.project_id);
  }
}