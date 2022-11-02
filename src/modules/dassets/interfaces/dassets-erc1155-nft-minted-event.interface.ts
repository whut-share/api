import { ISyncerEventMetadata } from "@/interfaces"

export interface IDassetsErc1155NftMintedEvent {
  network: string;
  to: string;
  token_id: number;
  project_id: string;
  event_metadata: ISyncerEventMetadata;
}