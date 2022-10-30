import { providers, Contract } from "ethers";

export type SichContractGetter = (contract_name: string, network: ISichNetwork) => Promise<Contract>;

export type SichJobArg = (number | string | boolean)

export interface ISichNetwork {
  rpc: string,
  key: string,
  block_time: number,
};

export interface ISichOpts {
  contractsGetter: SichContractGetter;
  loop_interval?: number;
  max_errors_count?: number;
}

export interface ISichStorageAdapter {

  retrieveRecordById(id: string): Promise<ISichRecord | false>

  setProcessed(id: string): Promise<void>

  saveTxDataAndStartProcessing(
    id: string, 
    tx_hash: string, 
    gas_amount: number, 
    gas_price: number, 
    hidden_till: Date
  ): Promise<void>

  selectAllPendingRecords(): Promise<ISichRecord[]>

  onSuccess(id: string, gas_used: number): Promise<void>

  onError(id: string, hidden_till: Date): Promise<void>

  newRecord(
    id: string, 
    contract: string, 
    method: string, 
    args: SichJobArg[],
    rpc: string,
    fee_max_cap?: number
  ): Promise<void>

  renewKilledRecord(id: string): Promise<void>

  isSichAdapter(): boolean

  killRecord(id: string): Promise<void>

}

export interface ISichRecord {
  readonly id: string;

  fee_max_cap?: number;
  tx_hash?: string;

  is_successful: boolean;
  is_killed: boolean;
  
  errors_count: number;

  is_processing: boolean;
  is_processed: boolean;
  hidden_till?: Date;

  gas_amount_est?: number;
  gas_amount_actual?: number;
  gas_price?: number;

  contract: string;
  method: string;
  args: SichJobArg[];

  network: string;
}