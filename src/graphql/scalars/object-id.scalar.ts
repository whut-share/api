import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId, Types } from "mongoose";

const regex = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

function validate(uuid: unknown): string {

  if(uuid.toString) {
    uuid = uuid.toString();
  }

  if (typeof uuid !== "string" || !regex.test(uuid)) {
    throw new Error("Invalid ObjectId");
  }
  
  return uuid;
}

export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'A simple ObjectId scalar. (example: "62d13a8b029b95001b881441")',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast) => ast.kind === Kind.STRING ? validate(ast.value) : null,
})