import { Sich } from "..";
import * as Ethers from "ethers";
import { fromWei } from "../helpers";
import { ISichNetwork } from "../interfaces";

export async function getGasPrice(this: Sich, network: ISichNetwork): Promise<string> {

  const provider = new Ethers.providers.JsonRpcProvider(network.rpc);

  if(new Date() >= this.fee_data.expire_at) {

    const price = (await provider.getFeeData()).gasPrice;

    this.fee_data = {
      price: price.toString(),
      expire_at: new Date(Date.now() + (30 * 1000)) // 30 sec
    };
  }

  console.log('asdasdasdasdasd', this.fee_data);

  return fromWei(this.fee_data.price);
}