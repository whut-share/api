export class IWebhooksCreate {
  project: string;
  url: string;
  idempotency_key?: string;
  data: any;
  metadata?: any;
}