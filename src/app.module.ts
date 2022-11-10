import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AppMongooseModule } from './providers/app-mongoose.module';
import { AppFileManagerModule } from './providers/app-file-manager.module';
import { DassetsModule } from './modules/dassets/dassets.module';
import { SyncerModule } from './modules/syncer/syncer.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { ResolversModule } from './graphql/resolvers.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppGqlModule } from './providers/app-gql.module';
import { AppSichModule } from './providers/app-sich.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StripeModule } from './modules/stripe/stripe.module';
import { WebhookEndpointsModule } from './modules/webhook-endpoints/webhook-endpoints.module';
import { DassetsCheckoutsModule } from './modules/dassets-checkouts/dassets-checkouts.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [

    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    AppGqlModule,
    AppMongooseModule,
    AppFileManagerModule,
    AppSichModule,
    ResolversModule,

    UsersModule,
    DassetsModule,
    SyncerModule,
    ProjectsModule,
    WebhooksModule,
    AuthModule,
    StripeModule,
    WebhookEndpointsModule,
    DassetsCheckoutsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
