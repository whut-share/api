import { User } from "@/schemas";
import { createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const UserParam = createParamDecorator((data, ctx): User => {
  
  const gqlctx = GqlExecutionContext.create(ctx);

  const request = gqlctx.getContext().req;
  
  return request.user;
});