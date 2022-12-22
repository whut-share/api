import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AppMongooseModule } from './providers/app-mongoose.module';
import { AppFileManagerModule } from './providers/app-file-manager.module';
import { MinterModule } from './modules/minter/minter.module';
import { SyncerModule } from './modules/syncer/syncer.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { ResolversModule } from './graphql/resolvers.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppGqlModule } from './providers/app-gql.module';
import { AppSichModule } from './providers/app-sich.module';
import { EventEmitterModule as EventEmitter2Module } from '@nestjs/event-emitter';
import { StripeModule } from './modules/stripe/stripe.module';
import { MinterCheckoutsModule } from './modules/minter-checkouts/minter-checkouts.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from './modules/event-emitter/event-emitter.module';
import { KeyBunchesModule } from './modules/key-bunches/key-bunches.module';
import { ChainNetworksModule } from './providers/chain-networks';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ScheduleModule.forRoot(),
    EventEmitter2Module.forRoot(),
    AppGqlModule,
    AppMongooseModule,
    AppFileManagerModule,
    AppSichModule,
    ChainNetworksModule,
    ResolversModule,

    UsersModule,
    MinterModule,
    SyncerModule,
    EventEmitterModule,
    ProjectsModule,
    WebhooksModule,
    AuthModule,
    StripeModule,
    MinterCheckoutsModule,
    KeyBunchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
