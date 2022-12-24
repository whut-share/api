import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { User, TUserDocument } from '@/schemas';
import { IUserCreate } from '../interfaces/user-create.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private user_model: Model<User>,

    private event_emitter: EventEmitter2,
  ) {}

  async selectAll(): Promise<User[]> {

    // throw new InvalidInputException('wrong-lol', 'Ahahahah');

    return await this.user_model.find();
  }

  async create(data: IUserCreate): Promise<TUserDocument> {


    if(await this.user_model.exists({ email: data.email })) {
      throw new InvalidInputException('EMAIL_BUSY', 'Email already busy');
    }

    const user = new this.user_model({
      email: data.email,
    });

    user.setPassword(data.password);

    await user.save();

    await this.event_emitter.emitAsync('user.created', user);

    return user;

  }
}