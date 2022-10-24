import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidInputException } from '@/exceptions';
import { User } from '@/schemas';
import { IAuthLogin } from '../interfaces/auth-login.interface';
import * as Jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private user_model: Model<User>,
  ) {}

  async login(data: IAuthLogin): Promise<{ token: string }> {
    
    const user = await this.user_model.findOne({ email: data.email });

    if(!user) {
      throw new InvalidInputException('AUTH_FAIL_LOGIN', 'Auth failed');
    }

    if(!user.validatePassword(data.password)) {
      throw new InvalidInputException('AUTH_FAIL_PASS', 'Auth failed');
    }

    return { token: user.generateJWT() };

  }

  async auth(token: string) {
    
    const { id } = await new Promise<{ id: string }>((resolve, reject) => {
      Jwt.verify(token, process.env['ACCESS_TOKEN_SECRET'], function(err, decoded) {
        if(err) {
          reject(err)
        } else {
          resolve(decoded);
        }
      });
    }).catch(err => {
      throw new InvalidInputException('AUTH_FAIL_BAD_TOKEN', 'Auth failed');
    });

    const user = await this.user_model.findOne({ _id: id });

    if(!user) {
      throw new InvalidInputException('AUTH_FAIL_UNKNOWN_USER', 'Auth failed');
    }

    return user;

  }
}