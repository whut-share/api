import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { EventEmitterInstance, Project, TProjectDocument, QueuedSyncerEvent, SyncerEvent, TEventEmitterInstanceDocument, TQueuedSyncerEventDocument, TSyncerEventDocument, User, TUserDocument, TSyncerInstanceDocument } from '@/schemas';
import * as Jwt from 'jsonwebtoken';
import { ISyncerEventDistributeWithPayload, ISyncerEventDistributeWithArgs } from '../interfaces/syncer-event-distribute.interface';
import { WebhooksService } from '@/modules/webhooks/services/webhooks.service';
import { ISyncerEventsFilter } from '../interfaces/syncer-events-filter.interface';

@Injectable()
export class EventEmitterEventsService {


  constructor(
    @InjectModel(EventEmitterInstance.name)
    private event_emitter_instance_model: Model<TEventEmitterInstanceDocument>,

    @InjectModel(QueuedSyncerEvent.name)
    private queued_syncer_event_model: Model<TQueuedSyncerEventDocument>,

    @InjectModel(SyncerEvent.name)
    private syncer_event_model: Model<TSyncerEventDocument>,

    private webhooks_service: WebhooksService,
  ) {}

  async select(
    user: TUserDocument, 
    query: ISyncerEventsFilter,
  ): Promise<TQueuedSyncerEventDocument[] | TSyncerEventDocument[]> {

    let events_storage_model: Model<TQueuedSyncerEventDocument> | Model<TSyncerEventDocument>;

    if(query.is_processed === false) {
      events_storage_model = this.queued_syncer_event_model;
    } else {
      events_storage_model = this.syncer_event_model;
    }

    const events = await events_storage_model.find(query)

    return events;
  }

  async processMany(
    user: TUserDocument, 
    ids: string[],
  ) {
    const events = await this.queued_syncer_event_model.find({
      _id: {
        $in: ids,
      }
    });

    await this.syncer_event_model.create(events.map(e => e.toObject()));

    await this.queued_syncer_event_model.deleteMany({
      _id: {
        $in: ids,
      }
    });
  }

  async distribute(
    syncer_instance: TSyncerInstanceDocument,
    data: ISyncerEventDistributeWithPayload | ISyncerEventDistributeWithArgs
  ): Promise<TQueuedSyncerEventDocument[]> {

    const eeis = await this.event_emitter_instance_model.find({
      syncer_instance: syncer_instance.id,
    });

    const events: TQueuedSyncerEventDocument[] = [];

    // TODO: make faster impl
    for (const eei of eeis) {
      const event = await this.queued_syncer_event_model.create({
        ...data,
        event_emitter_instance: eei.id,
      })

      // TODO: not reliable, possible disconnect here

      if(eei.is_webhook_emitter) {
        await this.webhooks_service.create({
          url: eei.webhook_endpoint,
          event: event.toObject(),
          event_emitter_instance: eei.id
        });
      }

      events.push(event);
    }

    return events;
  }
}