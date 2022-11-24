import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User, TUserDocument } from '@/schemas';
import { AuthGuard } from '@/guards';
import { UserParam } from '@/decorators';

@Controller('event-emitter')
@UsePipes(new ValidationPipe({ transform: true }))
export class EventEmitterController {

  constructor(
    
  ) {}
  
  @Post('mint')
  async mint(
    @Body() body: any,
  ) {
    
  }
}