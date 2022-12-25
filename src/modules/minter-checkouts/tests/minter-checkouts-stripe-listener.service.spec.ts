import { generateDefaultTestHooks, generateDefaultTestingModule } from '@/helpers';
import { StripeModule } from '@/modules/stripe/stripe.module';
import { MinterCheckoutSessionModelModule, MinterNftModelModule, ProjectModelModule, UserModelModule, WebhookModelModule } from '@/schemas';
import { MinterCheckoutsStripeListenerService } from '../services/minter-checkouts-stripe-listener.service';
import { ProjectsService } from '@/modules/projects/services/projects.service';
import { UsersService } from '@/modules/users/services/users.service';
import Stripe from 'stripe';
import { StripePaymentIntentMock } from '@/mocks';
import { AppSichModule } from '@/providers/app-sich.module';
import { ChainSyncerModule } from '@/providers/chain-syncer';
import { ProjectsModule } from '@/modules/projects/projects.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebhooksModule } from '@/modules/webhooks/webhooks.module';
import { MinterMigratorService } from '@/modules/minter/services/minter-migrator.service';
import { MinterCheckoutsService } from '../services/minter-checkouts.service';
import { MinterCheckoutsPriceEstimatorService } from '../services/minter-checkouts-price-estimator.service';
import { UsersModule } from '@/modules/users/users.module';
import { MinterSyncerListenerService } from '@/modules/minter/services/minter-syncer-listener.service';
import { MinterCheckoutsEventsProcessorService } from '../services/minter-checkouts-events-processor.service';

describe(MinterCheckoutsStripeListenerService.name, () => {

  let minter_stripe_listener_service: MinterCheckoutsStripeListenerService;
  let minter_session_service: MinterCheckoutsService;
  let projects_service: ProjectsService;
  let users_service: UsersService;
  let event_emitter: EventEmitter2;

  const address = '0xaa321420817C11860824a7cc5b30f6f18918EA15';

  generateDefaultTestHooks({
    metadata: {
      imports: [
        MinterCheckoutSessionModelModule,
        ProjectModelModule,
        UserModelModule,
        MinterNftModelModule,
        WebhookModelModule,
        StripeModule,
        AppSichModule,
        ChainSyncerModule,
        ProjectsModule,
        WebhooksModule,
        UsersModule,
      ],
      providers: [
        MinterCheckoutsStripeListenerService,
        MinterCheckoutsService,
        MinterMigratorService,
        MinterCheckoutsPriceEstimatorService,
        MinterSyncerListenerService,
        MinterCheckoutsEventsProcessorService,
      ],
    },
    async beforeEachHandler(app) {
      minter_stripe_listener_service = app.get<MinterCheckoutsStripeListenerService>(MinterCheckoutsStripeListenerService);
      minter_session_service = app.get<MinterCheckoutsService>(MinterCheckoutsService);
      projects_service = app.get<ProjectsService>(ProjectsService);
      users_service = app.get<UsersService>(UsersService);
      event_emitter = app.get(EventEmitter2);
      const minter_migrator_service = app.get<MinterMigratorService>(MinterMigratorService);

      await minter_migrator_service.migrate(true, [ 'local-test' ]);
    },
    async afterEachHandler() {
      
    }
  });

  // beforeEach(async () => {
    
  // })

  describe('handlePaymentIntentSuccseeded()', () => {
    
    it('should call sich job', async () => {

      const user = await users_service.create({
        email: 'qwe@qwe.qwe',
        password: 'qweqweqwe',
      })

      const project = await projects_service.create(user, {
        name: 'test',
      });

      project.minter_settings.webhook_events_url = 'http://localhost:8000';
      await project.save();

      const d_session = await minter_session_service.create(user, {
        project: project.id,
        asset_info: {
          id: '1',
          name: 'test',
          image_url: 'https://minter.io',
        },
      });      

      d_session.address = address;
      d_session.network = 'local-test';
      await d_session.save();

      await minter_stripe_listener_service.handlePaymentIntentSuccseeded({
        data: {
          ...StripePaymentIntentMock,
          metadata: {
            session_id: d_session.id,
            type: 'minter-checkout',
          },
        } as Stripe.PaymentIntent,
        evt_id: '123'
      });

      await new Promise((resolve, reject) => {
        event_emitter.once('minter.nft-minted', () => resolve(0));
      });

    }, 30000);
  });
});
