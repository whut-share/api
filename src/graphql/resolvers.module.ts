import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader'
import { Module } from '@nestjs/common';

import {
  ProjectModelModule,
  UserModelModule
} from '@/schemas';

import { TempFileModelModule } from '@/providers/temp-files/temp-files.model';
import { UsersService } from '@/modules/users/services/users.service';
import { UsersResolver } from '@/modules/users/users.resolver';
import { AuthService } from '@/modules/auth/services/auth.service';
import { ProjectsService } from '@/modules/projects/services/projects.service';
import { ProjectsResolver } from '@/modules/projects/projects.resolver';

@Module({
  imports: [

    /* Schemas */
    UserModelModule,
    TempFileModelModule,
    ProjectModelModule,
    
  ],
  providers: [

    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },

    /* Services */
    UsersService,
    AuthService,
    ProjectsService,

    /* Resolvers */
    UsersResolver,
    ProjectsResolver,

    /* DataLoaders */
  ],
})
export class ResolversModule {}