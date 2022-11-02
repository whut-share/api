import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { User, UserDocument } from '@/schemas';
import { IUsersCreate } from '../interfaces/users-create.interface';

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

  async create(data: IUsersCreate): Promise<UserDocument> {

    const user = new this.user_model({
      email: data.email,
    });

    user.setPassword(data.password);

    return await user.save();

  }
}