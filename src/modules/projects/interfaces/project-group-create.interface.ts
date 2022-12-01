import { ObjectIdScalar } from "@/graphql/scalars";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class IProjectGroupCreate {

  @Field()
  name: string;

  @Field({ nullable: true })
  pic?: string;

  @Field(type => [ObjectIdScalar], { nullable: true })
  projects?: string[];
  
}