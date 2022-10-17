// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";

// interface SeederOpts<TDoc> {

//   model_name: string;

//   filler: (data: TDoc | any) => TDoc;
  
// }


// class SeederBase<TDoc> implements ISeeder<TDoc> {
      
//   constructor(
//     @InjectModel(opts.model_name)
//     public model: Model<TDoc>,
//   ) {}

//   private filler: (data: TDoc | any) => TDoc;
  
//   async seedOne(data: TDoc | any): Promise<TDoc> {
  
//     return await this.model.create(this.filler(data));
    
//   }

//   async seedMany(amount: number, data?: (TDoc | any)[]): Promise<TDoc[]> {

//     if(typeof data !== 'undefined') {

//       if(data.length !== amount) {
//         throw new Error('Amount of documents must be the same as amount arg');
//       }
//     } else {
//       data = (new Array(amount)).fill({}).map(n => this.filler(data))
//     }
    
//     return await this.model.create(data);
    
//   }
// }

// export function Seeder<TDoc>(opts: SeederOpts<TDoc>) {

//   return function(target: any) {
//     var original = target;

//     // the new constructor behaviour
//     var f : any = function (...args) {
//       //return  original.apply(this, args);
//       return new original(...args); // according the comments
//     }

//     // copy prototype so intanceof operator still works
//     f.prototype = original.prototype;

//     f.filler = opts.filler;

//     // return new constructor (will override original)
//     return f;
//   }
  
//   // return function(target: any) {

//   //   target.constructor = function(
//   //     @InjectModel(opts.model_name) 
//   //     model: Model<TDoc>,
//   //   ) {
//   //     this.model = model;
//   //   }
    
//   //   target.seedOne = async function(data: TDoc | any): Promise<TDoc> {
    
//   //     return await this.model.create(this.generateFiller(data));
      
//   //   }
  
//   //   target.seedMany = async function(amount: number, data?: (TDoc | any)[]): Promise<TDoc[]> {
  
//   //     if(typeof data !== 'undefined') {
  
//   //       if(data.length !== amount) {
//   //         throw new Error('Amount of documents must be the same as amount arg');
//   //       }
//   //     } else {
//   //       data = (new Array(amount)).fill({}).map(n => opts.filler(data))
//   //     }
      
//   //     return await this.model.create(data);
      
//   //   }
//   // }
// }

// export interface ISeeder<TDoc> {
//   seedMany(amount: number, data: (TDoc | any)[]): Promise<TDoc[]>;
//   seedOne(data: TDoc | any): Promise<TDoc>;
// }