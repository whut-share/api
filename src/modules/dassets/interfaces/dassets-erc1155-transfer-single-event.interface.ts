import { ISyncerEventMetadata } from "@/interfaces"

export interface IDassetsErc1155TransferSingleEvent {
  network: string;
  operator: string;
  from: string;
  to: string;
  token_id: number;
  value: string;
  event_metadata: ISyncerEventMetadata;
}