import { ObjectIdScalar } from "@/graphql/scalars";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import GraphQLJSON from 'graphql-type-json';

export const AppGqlModule = GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  // sortSchema: true,
  playground: true,
  introspection: true,
  persistedQueries: false,
  cache: 'bounded',
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
    JSON: GraphQLJSON,
  },
});