import { Sich } from "..";
import { ISichNetwork, ISichRecord, SichJobArg } from "../interfaces";

export function addNetwork(
  this: Sich,
  network: ISichNetwork
): void {
  if(this.networks.find(n => n.id === network.id)) {
    return;
  }

  this.networks.push(network);
}