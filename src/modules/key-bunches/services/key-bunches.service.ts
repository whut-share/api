import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { KeyBunch, TKeyBunchDocument, User, TUserDocument } from '@/schemas';
import { merge } from 'lodash';
import { assemblyContractRoute } from '@/helpers';
import { IKeyBunchCreate } from '../interfaces/key-bunch-create.interface';
import { SyncerInstancesService } from '@/modules/syncer/services/syncer-instances.service';
import { OnEvent } from '@nestjs/event-emitter';


@Injectable()
export class KeyBunchesService {


  constructor(
    @InjectModel(KeyBunch.name) 
    private readonly key_bunch_model: Model<TKeyBunchDocument>,
  ) {}


  async select(user: TUserDocument): Promise<TKeyBunchDocument[]> {
    return await this.key_bunch_model.find({ user: user.id });
  }


  async getOrFail(user: TUserDocument, id: string): Promise<TKeyBunchDocument> {

    const key_bunch = await this.key_bunch_model.findOne({ _id: id });

    if(key_bunch.user != user.id) {
      throw new InvalidInputException('ACCESS_DENIED', 'Access denied');
    }

    if(!key_bunch) {
      throw new InvalidInputException('NOT_FOUND', 'Entity not found');
    }

    return key_bunch;
  }


  async create(
    user: TUserDocument, 
    data: IKeyBunchCreate
  ): Promise<TKeyBunchDocument> {
    const key_bunch = new this.key_bunch_model({
      ...data,
      user: user.id,
    });

    await key_bunch.generateKeys();

    await key_bunch.save();

    return key_bunch;
  }
}