import { ObjectIdScalar } from "@/graphql/scalars";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class IProjectGroupUpdate {

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  pic?: string;

  @Field(type => [ObjectIdScalar], { nullable: true })
  projects?: string[];
  
}