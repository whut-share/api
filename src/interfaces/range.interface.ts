import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class IRange {

  @Field((type) => Int, { nullable: true })
  min?: number;

  @Field((type) => Int, { nullable: true })
  max?: number;
  
}