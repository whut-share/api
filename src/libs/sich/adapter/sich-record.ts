import { ISichRecord, SichJobArg } from "../interfaces";
import MongoDB from "mongodb";

interface ISichRecordCreate {
  id: string;

  fee_max_cap?: number;

  contract: string;
  method: string;
  args: SichJobArg[];

  network: string;
}

export class SichRecord implements ISichRecord {

  public get id(): string {
    return this._id;
  }

  public _id: string;
  public fee_max_cap?: number;
  public tx_hash?: string;

  public is_successful: boolean;
  public is_killed: boolean;

  public errors_count: number;

  public is_processing: boolean;
  public is_processed: boolean;
  public hidden_till?: Date;

  public gas_amount_est?: number;
  public gas_amount_actual?: number;
  public gas_price?: number;

  public contract: string;
  public method: string;
  public args: SichJobArg[];

  public network: string;

  constructor(
    data: ISichRecordCreate
  ) {

    this._id = data.id;

    delete data.id;

    for (const key in data) {
      this[key] = data[key];
    }

    this.is_successful = false;
    this.is_killed = false;
    this.errors_count = 0;
    this.is_processing = false;
    this.is_processed = false;
  }
}