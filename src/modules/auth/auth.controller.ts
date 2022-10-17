import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@/schemas';
// import { EntityParam } from 'src/decorators';
// import { ParseEntity } from 'src/pipes';
// import { User } from './user.model';
import { AuthService } from './services/auth.service';
import { IAuthLogin } from './interfaces/auth-login.interface';

@Controller('auth')
export class AuthController {

  constructor(
    private auth_service: AuthService,
  ) {}
  
  @Post()
  login(@Body() data: IAuthLogin): Promise<{ token: string }> {
    return this.auth_service.login(data);
  }
}