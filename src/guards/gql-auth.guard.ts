import { AuthService } from '@/modules/auth/services/auth.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard implements CanActivate {

  constructor(
    private auth_service: AuthService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const ctx = GqlExecutionContext.create(context);

    const request = ctx.getContext().req;
    
    const [ _, authorization ] = (request.headers.authorization || '').split(' ');    

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