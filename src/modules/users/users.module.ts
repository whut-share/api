import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserModelModule, UserSchema } from '@/schemas';

@Module({
  imports: [
    UserModelModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}