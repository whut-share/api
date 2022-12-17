import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId, Types } from "mongoose";

function validate(uuid: unknown): string {

  if (typeof uuid !== "string") {
    throw new Error("Invalid Keccak256");
  }
  
  return uuid;
}

export const Keccak256Scalar = new GraphQLScalarType({
  name: 'Keccak256',
  description: 'A keccak256 scalar. (type: string) (example: "0xbbdf3616512df59a06f9c800ac8da843b3a0926340249b3910b18d7d64992124")',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast) => ast.kind === Kind.STRING ? validate(ast.value) : null,
})