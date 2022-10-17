import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";

@ObjectType()
export class NestedBaseClass {

  @Field()
  public created_at?: Date;

  @Field()
  public updated_at?: Date;

}

@ObjectType()
export class BaseClass extends NestedBaseClass {

  protected getDep<TClass = any>(key): TClass {
    return key;
  }

  _doc?: any;

  __v?: number;

  public static model: Model<any>;

}

export function defaultUseFactory(schema: any) {
  return function() {

    const deps = {};

    this.inject.forEach((n, i) => {

      const key = n.name || n;

      deps[key] = arguments[i];
    })

    schema.methods.getDep = function(key) {

      key = key.name || key;

      return deps[key];
    };
    return schema;
  }
}


export function fixSchema<TClass = any>(schema: TClass, with_class: any): TClass {
  
  // @ts-ignore
  schema.loadClass(with_class);

  return schema;
}