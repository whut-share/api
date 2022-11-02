export interface ISyncerEventMetadata {
  transaction_hash: string;
  block_number: number;
  block_timestamp: number;
  log_index: number;
  global_index: number;
  from_address: string;
}