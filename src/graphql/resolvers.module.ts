import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader'
import { Module } from '@nestjs/common';

import {
  UserModelModule
} from '@/schemas';

import { TempFileModelModule } from '@/providers/temp-files/temp-files.model';

@Module({
  imports: [

    /* Schemas */
    UserModelModule,
    TempFileModelModule,
    
  ],
  providers: [

    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },

    /* Services */
    

    /* Resolvers */


    /* DataLoaders */
  ],
})
export class ResolversModule {}