import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { DassetsNft, TDassetsNftDocument, Project, TProjectDocument, User, TUserDocument } from '@/schemas';
import Stripe from 'stripe';
import { merge } from 'lodash';
import { IDassetsNftsFilter } from '../interfaces/dassets-nfts-filter.interface';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DassetsNftsService {


  constructor(
    @InjectModel(DassetsNft.name) 
    private dassets_nft_model: Model<TDassetsNftDocument>,

    @InjectModel(Project.name) 
    private project_model: Model<TProjectDocument>,
  ) {}


  async getOrFail(id: string): Promise<TDassetsNftDocument> {
    const session = await this.dassets_nft_model.findOne({ _id: id });

    if(!session) {
      throw new InvalidInputException('NOT_FOUND', 'Session not found');
    }

    return session;
  }


  async select(user: TUserDocument, data: IDassetsNftsFilter): Promise<TDassetsNftDocument[]> {

    const project_ids = await this.project_model.find({
      user: user.id,
    }).select('_id').then((projects) => projects.map((project) => project.id));

    const query = {
      project: {
        $in: project_ids,
      },
    };

    if(data.network) {
      merge(query, {
        network: data.network,
      });
    }

    const nfts = await this.dassets_nft_model.find(query);

    return nfts;
  }

}