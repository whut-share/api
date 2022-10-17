import { MongooseModule } from '@nestjs/mongoose';

export const AppMongooseModule = MongooseModule.forRoot(process.env['MONGO_SRV'], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  readPreference: 'primary',
  writeConcern: { w: 'majority', j: true },
})