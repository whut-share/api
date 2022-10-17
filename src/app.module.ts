import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AppMongooseModule } from './providers/app-mongoose.module';
import { AppFileManagerModule } from './providers/app-file-manager.module';
import { DassetsModule } from './modules/dassets/dassets.module';
import { AppChSyModule } from './providers/app-chsy.module';
import { SyncerModule } from './modules/syncer/syncer.module';

@Module({
  imports: [
    AppMongooseModule,
    AppFileManagerModule,
    AppChSyModule,

    UsersModule,
    DassetsModule,
    SyncerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
