import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class IPagination {

  @Field((type) => Int)
  @Min(1, { message: 'Take must be greater than 0' })
  @Max(512, { message: 'Max limit is 512' })
  take?: number = 512;

  @Field((type) => Int)
  @Min(1, { message: 'Page must be greater than 0' })
  page?: number = 1;

  public get skip(): number {
    return (this.page - 1) * this.take;
  }
  
}