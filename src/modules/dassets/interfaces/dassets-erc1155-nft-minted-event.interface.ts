import { ISyncerEventMetadata } from "@/interfaces"

export interface IDassetsErc1155NftMintedEvent {
  mint_request_id: string;
  network: string;
  to: string;
  token_id: number;
  project_id: string;
  event_metadata: ISyncerEventMetadata;
}