import { IChainSyncerEventMetadata } from "chain-syncer";

export interface IDassetsNftMintedEvent {
  mint_request_id: string;
  network: string;
  to: string;
  token_id: number;
  project_id: string;
  event_metadata: IChainSyncerEventMetadata;
}