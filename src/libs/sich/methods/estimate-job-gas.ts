import { BigNumber, utils } from "ethers";
import { Sich } from "..";
import { fromWei } from "../helpers";
import { SichJobArg } from "../interfaces";

interface GasEstimation {
  gas_price: number
  gas: number
  total_eth: number
}

export async function estimateJobGas(
  this: Sich,
  contract_name: string,
  method: string,
  args: SichJobArg[],
  network_key: string
): Promise<GasEstimation> {
  
  const network = this.networks.find(n => n.key === network_key);

  if(!network) {
    throw new Error('Network not registered');
  }

  const contract = await this.contractsGetter(contract_name, network);

  const gas = (await contract.estimateGas[method](...args)).toNumber();

  const gas_price = Number(await this.getGasPrice(network));

  const total_eth = (gas * gas_price);

  return {
    gas_price,
    gas,
    total_eth,
  };
}