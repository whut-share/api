import { SyncerEvent } from "@/schemas";

export class IWebhookCreate {
  url: string;
  event: SyncerEvent;
  event_emitter_instance: string;
  metadata?: any;
}