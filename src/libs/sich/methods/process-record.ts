import { BigNumber, providers, utils } from "ethers";
import { Sich } from "..";
import { fromWei, toWei } from "../helpers";
import { ISichRecord } from "../interfaces";

export async function processRecord(
  this: Sich, 
  record: ISichRecord
): Promise<void> {

  const { contract, method, args } = record;
  const network = this.networks.find(n => n.key === record.network);

  if(!network) {
    throw new Error('Network not registered');
  }

  const contract_inst = await this.contractsGetter(contract, network);

  if(record.tx_hash) {
    const receipt = await contract_inst.provider.getTransactionReceipt(record.tx_hash);
    await this.onReceiptProcess(receipt, record.id);
    return;
  }

  const unsigned_tx = await contract_inst.populateTransaction[method](...args);
  unsigned_tx.gasPrice = BigNumber.from(await this.getGasPrice(network).then(res => res.gas_price_wei));

  delete unsigned_tx.from;

  console.log('unsigned_tx', unsigned_tx);

  const signed_tx = await contract_inst.signer.populateTransaction(unsigned_tx);

  console.log('signed_tx', signed_tx);
  
  const sign = await contract_inst.signer.signTransaction(signed_tx);

  const tx_hash = utils.keccak256(sign);

  const gas_limit = Number(signed_tx.gasLimit.toString());
  const gas_price = Number(fromWei(signed_tx.gasPrice));

  if(record.fee_max_cap && record.fee_max_cap < (gas_limit * gas_price)) {
    throw new Error('Fee max cap exceeded');
  }

  // save tx hash, gas, gas price, amount_used
  await this.adapter.saveTxDataAndStartProcessing(
    record.id, 
    tx_hash, 
    gas_limit,
    gas_price, 
    new Date(Date.now() + (network.block_time * 20))
  );

  await contract_inst.provider.sendTransaction(sign);
}