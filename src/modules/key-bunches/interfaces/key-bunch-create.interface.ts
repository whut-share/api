import { ObjectIdScalar } from "@/graphql/scalars";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class IKeyBunchCreate {

  @Field()
  name: string;

  @Field(type => ObjectIdScalar)
  project: string;
  
}