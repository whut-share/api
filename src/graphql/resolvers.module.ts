import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader'
import { Module } from '@nestjs/common';

import {
  UserModelModule
} from '@/schemas';

import { TempFileModelModule } from '@/providers/temp-files/temp-files.model';
import { UsersService } from '@/modules/users/services/users.service';
import { UsersResolver } from '@/modules/users/users.resolver';
import { AuthService } from '@/modules/auth/services/auth.service';

@Module({
  imports: [

    /* Schemas */
    UserModelModule,
    TempFileModelModule,
    
  ],
  providers: [

    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },

    /* Services */
    UsersService,
    AuthService,

    /* Resolvers */
    UsersResolver,

    /* DataLoaders */
  ],
})
export class ResolversModule {}