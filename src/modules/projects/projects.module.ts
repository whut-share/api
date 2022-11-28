import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader'

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DassetsNftModelModule, ProjectModelModule, SyncerInstanceModelModule, User, UserSchema } from '@/schemas';
import { ProjectsService } from './services/projects.service';
import { ProjectsSeedCmd } from './cmd/projects-seed.cmd';
import { SyncerModule } from '../syncer/syncer.module';
import { ProjectsResolver } from './projects.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ProjectModelModule,
    SyncerInstanceModelModule,
    SyncerModule,
    AuthModule,
  ],
  providers: [

    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },

    ProjectsService,
    ProjectsSeedCmd,
    ProjectsResolver,
  ],
  exports: [
    ProjectsService,
  ],
  controllers: [],
})
export class ProjectsModule {}