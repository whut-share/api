import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader'

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DassetsNftModelModule, ProjectGroupModelModule, ProjectModelModule, SyncerInstanceModelModule, User, UserSchema } from '@/schemas';
import { ProjectsService } from './services/projects.service';
import { ProjectsSeedCmd } from './cmd/projects-seed.cmd';
import { SyncerModule } from '../syncer/syncer.module';
import { ProjectsResolver } from './projects.resolver';
import { AuthModule } from '../auth/auth.module';
import { ProjectGroupsService } from './services/projects-groups.service';
import { ProjectsHelperService } from './services/projects-helper.service';
import { ProjectGroupsResolver } from './project-groups.resolver';
import { KeyBunchesModule } from '../key-bunches/key-bunches.module';

@Module({
  imports: [
    ProjectModelModule,
    SyncerInstanceModelModule,
    ProjectGroupModelModule,
    SyncerModule,
    AuthModule,
    KeyBunchesModule,
  ],
  providers: [

    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },

    ProjectsService,
    ProjectsSeedCmd,
    ProjectsResolver,

    ProjectGroupsService,
    ProjectsHelperService,
    ProjectGroupsResolver,
  ],
  exports: [
    ProjectsService,
  ],
  controllers: [],
})
export class ProjectsModule {}