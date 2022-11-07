export class IWebhookCreate {
  project: string;
  url: string;
  event_id: string;
  data: any;
  metadata?: any;
}