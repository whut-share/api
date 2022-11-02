import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DassetNftModelModule, ProjectModelModule, ScanTargetModelModule, User, UserSchema } from '@/schemas';
import { ProjectsService } from './services/projects.service';
import { ProjectsSeedCmd } from './cmd/projects-seed.cmd';

@Module({
  imports: [
    ProjectModelModule,
  ],
  providers: [
    ProjectsService,
    ProjectsSeedCmd,
  ],
  exports: [
    ProjectsService,
  ],
  controllers: [],
})
export class ProjectsModule {}