import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserModelModule, UserSchema } from '@/schemas';

@Module({
  imports: [
    UserModelModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}