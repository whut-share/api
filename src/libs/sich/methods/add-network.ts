import { Sich } from "..";
import { ISichNetwork, ISichRecord, SichJobArg } from "../interfaces";

export function addNetwork(
  this: Sich,
  network: ISichNetwork
): void {
  if(this.networks.find(n => n.key === network.key)) {
    return;
  }

  this.networks.push(network);
}