import { GraphQLScalarType, Kind } from "graphql";

const regex = /^0x[a-fA-F0-9]{40}$/;

function validate(val: unknown): string | never {
  if (typeof val !== "string" || !regex.test(val)) {
    throw new Error("Invalid Address");
  }
  return val.toLowerCase();
}

export const AddressScalar = new GraphQLScalarType({
  name: 'Address',
  description: 'A simple Address parser (eg. "0x509016ec41c0F4b3072cA7c000034845163ECA0E")',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast) => ast.kind === Kind.STRING ? validate(ast.value) : null,
})