import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { User } from '@/schemas';
import { RegDto } from '../dtos/reg.dto';

@Injectable()
export class RegService {

  constructor(
    @InjectModel(User.name)
    private user_model: Model<User>,
  ) {}

  async reg(data: RegDto) {
    
    const user = new this.user_model(data);
    await user.save();
    return user;
  }
}