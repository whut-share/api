import { Sich } from "..";
import * as Ethers from "ethers";
import { fromWei } from "../helpers";
import { ISichNetwork } from "../interfaces";

export async function getGasPrice(this: Sich, network: ISichNetwork) {

  const provider = new Ethers.providers.JsonRpcProvider(network.rpc);

  const price = (await provider.getFeeData()).maxFeePerGas;

  return {
    gas_price_wei: price,
    gas_price: fromWei(price),
  };
}