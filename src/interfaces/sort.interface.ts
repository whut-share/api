import { IRange } from "@/interfaces/range.interface";
import { AddressScalar } from "@/graphql/scalars";
import { InputType, Field, registerEnumType } from "@nestjs/graphql";

export enum SortDirection {
  ASC = 1,
  DESC = -1,
}

registerEnumType(SortDirection, {
  name: "SortDirection",
});

@InputType()
export abstract class ISort {

  @Field(type => SortDirection)
  direction: SortDirection = SortDirection.ASC;

  @Field()
  by_field: string = 'createdAt';

}