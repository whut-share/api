import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId, Types } from "mongoose";

function validate(uuid: unknown): string {

  if (typeof uuid !== "string") {
    throw new Error("Invalid Network");
  }
  
  return uuid;
}

export const NetworkScalar = new GraphQLScalarType({
  name: 'Network',
  description: 'A network scalar. See https://docs.interactwith.com/docs/getting-started/supported-chains for the full list of supported networks. (type: string) (example: "eth")',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast) => ast.kind === Kind.STRING ? validate(ast.value) : null,
})