import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { User } from '@/schemas';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private user_model: Model<User>,
  ) {}

  async selectAll(): Promise<User[]> {

    // throw new InvalidInputException('wrong-lol', 'Ahahahah');

    return await this.user_model.find();
  }
}