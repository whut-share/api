import { GraphQLScalarType, Kind } from "graphql";

export const VoidScalar = new GraphQLScalarType({
  name: 'Void',
  description: 'Void type',
  serialize: (value) => true,
  parseValue: (value) => true,
  parseLiteral: (ast) => true,
})