import MongoDB from "mongodb";
import { ISichRecord, ISichStorageAdapter, SichJobArg } from "../interfaces";
import { SichRecord } from "./sich-record";

interface MongoDBAdapterOpts {
  prefix?: string;
}

export class SichMongoDBAdapter implements ISichStorageAdapter {

  private db: MongoDB.Db;
  private queue: MongoDB.Collection<SichRecord>;
  private archive: MongoDB.Collection<SichRecord>;

  public isSichAdapter() {
    return true
  };

  constructor(
    db: MongoDB.Db, 
    opts: MongoDBAdapterOpts = {}
  ) {
    this.db = db;
    this._initCollections(opts.prefix || 'sich_');
  }

  _initCollections(prefix: string) {
    this.queue = this.db.collection<SichRecord>(`${prefix}queue`);
    this.archive = this.db.collection<SichRecord>(`${prefix}archive`);
  }

  async retrieveRecordById(id: string) {

    const item = await this.queue.findOne({ _id: id });

    if(item) {
      return item;
    }
    
    return false;
  }

  async setProcessed(id: string) {

    await this.queue.updateOne({
      _id: id,
    }, {
      $set: {
        is_processed: true
      }
    })
  }

  async saveTxDataAndStartProcessing(
    id: string, 
    tx_hash: string, 
    gas_amount: number, 
    gas_price: number, 
    hidden_till: Date
  ) {

    await this.queue.updateOne({
      _id: id,
    }, {
      $set: {
        tx_hash,
        gas_amount_est: gas_amount,
        gas_price,
        is_processing: true,
        is_processed: false,
        hidden_till,
      }
    });
  }

  async selectAllPendingRecords() {

    const data: unknown = await this.queue.find({
      is_processed: false,
      $or: [
        { is_processing: false },
        { hidden_till: { $lte: new Date() }, is_processing: true }
      ],
    }).toArray();

    return (data as ISichRecord[]).map(n => new SichRecord(n));
  }

  async onSuccess(id: string, gas_used: number) {

    await this.queue.updateOne({
      _id: id,
    }, {
      $set: {
        is_successful: true,
        is_processing: false,
        is_processed: true,
        gas_amount_actual: gas_used,
      },
      $unset: {
        hidden_till: 1,
      },
    })
  }

  async newRecord(
    id: string, 
    contract: string, 
    method: string, 
    args: SichJobArg[],
    network: string,
    fee_max_cap?: number
  ) {

    const record = new SichRecord({
      id,
      contract,
      method,
      args,
      network,
      fee_max_cap,
    });

    await this.queue.insertOne(record)
  }

  async renewKilledRecord(
    id: string, 
  ) {
    await this.queue.updateOne({
      _id: id, 
      is_killed: true
    }, {
      $set: {
        errors_count: 0,
        is_killed: false,
      },
      $unset: {
        hidden_till: 1,
        tx_hash: 1,
        gas_amount_est: 1,
        gas_amount_actual: 1,
        gas_price: 1,
      },
    })
  }

  async onError(id: string, hidden_till: Date) {
    await this.queue.updateOne({
      _id: id,
    }, {
      $inc: { errors_count: 1 },
      $set: { hidden_till },
    });
  }


  async killRecord(id: string) {
    await this.queue.deleteOne({
      _id: id,
    });
  }
}