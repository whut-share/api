import { generateDefaultTestHooks, generateDefaultTestingModule } from '@/helpers';
import { StripeModule } from '@/modules/stripe/stripe.module';
import { DassetFlowSessionModelModule, DassetNftModelModule, ProjectModelModule, UserModelModule, WebhookModelModule } from '@/schemas';
import { Test, TestingModule } from '@nestjs/testing';
import { DassetsMinterService } from '../services/dassets-minter.service';
import { DassetsSessionService } from '../services/dassets-session.service';
import { DassetsStripeListenerService } from '../services/dassets-stripe-listener.service';
import { ProjectsService } from '@/modules/projects/services/projects.service';
import { UsersService } from '@/modules/users/services/users.service';
import Stripe from 'stripe';
import { StripePaymentIntentMock } from '@/mocks';
import { AppSichModule } from '@/providers/app-sich.module';
import { ChainSyncerModule } from '@/providers/chain-syncer';
import { DassetsMigratorService } from '../services/dassets-migrator.service';
import { ProjectsModule } from '@/modules/projects/projects.module';
import { DassetsPriceEstimatorService } from '../services/dassets-price-estimator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DassetsSyncerListenerService } from '../services/dassets-syncer-listener.service';
import { DassetsEventsProcessorService } from '../services/dassets-events-processor.service';
import { WebhooksModule } from '@/modules/webhooks/webhooks.module';

describe(DassetsStripeListenerService.name, () => {

  let dassets_stripe_listener_service: DassetsStripeListenerService;
  let dassets_session_service: DassetsSessionService;
  let projects_service: ProjectsService;
  let users_service: UsersService;
  let event_emitter: EventEmitter2;

  const address = '0xaa321420817C11860824a7cc5b30f6f18918EA15';

  generateDefaultTestHooks({
    metadata: {
      imports: [
        DassetFlowSessionModelModule,
        ProjectModelModule,
        UserModelModule,
        DassetNftModelModule,
        WebhookModelModule,
        StripeModule,
        AppSichModule,
        ChainSyncerModule,
        ProjectsModule,
        WebhooksModule,
      ],
      providers: [
        DassetsMinterService, 
        DassetsStripeListenerService,
        DassetsPriceEstimatorService,
        DassetsSessionService,
        UsersService,
        DassetsMigratorService,
        DassetsSyncerListenerService,
        DassetsEventsProcessorService,
      ],
    },
    async beforeEachHandler(app) {
      dassets_stripe_listener_service = app.get<DassetsStripeListenerService>(DassetsStripeListenerService);
      dassets_session_service = app.get<DassetsSessionService>(DassetsSessionService);
      projects_service = app.get<ProjectsService>(ProjectsService);
      users_service = app.get<UsersService>(UsersService);
      event_emitter = app.get(EventEmitter2);
      const dassets_migrator_service = app.get<DassetsMigratorService>(DassetsMigratorService);

      await dassets_migrator_service.migrate();
    },
    async afterEachHandler() {
      
    }
  });

  // beforeEach(async () => {
    
  // })

  describe('handlePaymentIntentSuccseeded()', () => {
    
    it('should set session as succeeded', async () => {

      const user = await users_service.create({
        email: 'qwe@qwe.qwe',
        password: 'qweqweqwe',
      })

      const project = await projects_service.create(user, {
        name: 'test',
      });

      project.dassets.webhook_events_url = 'http://localhost:8000';
      await project.save();

      const d_session = await dassets_session_service.create(user, {
        project: project.id,
      });

      d_session.address = address;
      d_session.network = 'local-test';
      await d_session.save();

      await dassets_stripe_listener_service.handlePaymentIntentSuccseeded({
        data: {
          ...StripePaymentIntentMock,
          metadata: {
            dasset_flow_session_id: d_session.id,
            type: 'dasset-flow-session',
          },
        } as Stripe.PaymentIntent,
        evt_id: '123'
      });

      await new Promise((resolve, reject) => {
        event_emitter.once('dassets.erc1155.nft-minted', () => resolve(undefined));
      });

    }, 100000);
  });
});
