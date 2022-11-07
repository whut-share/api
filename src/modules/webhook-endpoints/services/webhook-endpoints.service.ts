import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { IWebhookEndpointCreate } from '../interfaces/webhook-endpoint-create.interface';
import { Project, ProjectDocument, UserDocument, WebhookEndpoint, WebhookEndpointDocument } from '@/schemas';
import { InvalidInputException } from '@/exceptions';
import { IWebhookEndpointUpdate } from '../interfaces/webhook-endpoint-update.interface';

@Injectable()
export class WebhookEndpointsService {

  constructor(
    @InjectModel(WebhookEndpoint.name)
    private webhook_endpoint_model: Model<WebhookEndpointDocument>,

    @InjectModel(Project.name)
    private project_model: Model<ProjectDocument>,
  ) {}

  async hasAccessOrFail(user: UserDocument, project_id: string) {
    const project = await this.project_model.findOne({ _id: project_id, user: user._id });

    if (!project) {
      throw new InvalidInputException('ACCESS_DENIED', 'You do not have access to this project.');
    }
  }

  async getOrFail(user: UserDocument, id: string) {

    const we = await this.webhook_endpoint_model.findOne({ _id: id });

    await this.hasAccessOrFail(user, we.project);

    if (!we) {
      throw new InvalidInputException('NOT_FOUND', 'Webhook endpoint not found.');
    }

    return we;
  }

  async create(user: UserDocument, data: IWebhookEndpointCreate) {

    await this.hasAccessOrFail(user, data.project);

    const webhook = new this.webhook_endpoint_model(data);

    return await webhook.save();
  }

  async update(
    user: UserDocument, 
    we: WebhookEndpointDocument, 
    data: IWebhookEndpointUpdate
  ) {

    await this.hasAccessOrFail(user, we.project);

    const webhook = new this.webhook_endpoint_model(data);

    return await webhook.save();
  }

  async select(user: UserDocument) {
    
    const projects = await this.project_model.find({ user: user._id });

    const project_ids = projects.map(p => p._id);

    return await this.webhook_endpoint_model.find({ project: { $in: project_ids } });
    
  }

  async delete(user: UserDocument, we: WebhookEndpointDocument) {

    await this.hasAccessOrFail(user, we.project);

    await we.delete();
  }
}