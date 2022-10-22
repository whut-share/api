import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AppMongooseModule } from './providers/app-mongoose.module';
import { AppFileManagerModule } from './providers/app-file-manager.module';
import { DassetsModule } from './modules/dassets/dassets.module';
import { SyncerModule } from './modules/syncer/syncer.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AddressScalar, ObjectIdScalar, VoidScalar } from './graphql/scalars';
import GraphQLJSON from 'graphql-type-json';
import { ResolversModule } from './graphql/resolvers.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // sortSchema: true,
      playground: true,
      introspection: true,
      persistedQueries: false,
      formatError: error => {
        
        return {
          // @ts-ignore
          message: error.message || error?.extensions?.response?.message[0],
          locations: error.locations,
          path: error.path,
          code: error.extensions.code,
          stacktrace: error.extensions?.exception?.stacktrace,
        };
      },
      resolvers: {
        ObjectId: ObjectIdScalar,
        // Void: VoidScalar,
        // Address: AddressScalar,
        // JSON: GraphQLJSON,
      },
    }),

    AppMongooseModule,
    AppFileManagerModule,
    ResolversModule,

    UsersModule,
    DassetsModule,
    SyncerModule,
    ProjectsModule,
    WebhooksModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
