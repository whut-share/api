import { AuthService } from '@/modules/auth/services/auth.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private auth_service: AuthService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    
    const [ _, authorization ] = request.headers.authorizationn.split(' ');    

    if(!authorization) {
      return false;
    }

    try {
      const user = await this.auth_service.auth(authorization);
      request.user = user;
    } catch (error) {
      return false;
    }
    
    return true;
  }
}