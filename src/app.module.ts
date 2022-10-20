import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AppMongooseModule } from './providers/app-mongoose.module';
import { AppFileManagerModule } from './providers/app-file-manager.module';
import { DassetsModule } from './modules/dassets/dassets.module';
import { SyncerModule } from './modules/syncer/syncer.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ChainSyncerModule } from './providers/chain-syncer';
import { WebhooksModule } from './modules/webhooks/webhooks.module';

@Module({
  imports: [
    AppMongooseModule,
    AppFileManagerModule,

    UsersModule,
    DassetsModule,
    SyncerModule,
    ProjectsModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
