import { Controller, Get, Param } from '@nestjs/common';
import { User } from '@/schemas';
import { UsersService } from './services/users.service';

@Controller('users')
export class UsersController {

  constructor(
    private users_service: UsersService,
  ) {}
  
  @Get()
  selectAll(): Promise<User[]> {
    return this.users_service.selectAll();
  }
}