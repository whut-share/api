import { IChainSyncerEventMetadata } from "chain-syncer";

export interface IMinterTransferSingleEvent {
  network: string;
  operator: string;
  from: string;
  to: string;
  token_id: number;
  value: string;
  event_metadata: IChainSyncerEventMetadata;
}