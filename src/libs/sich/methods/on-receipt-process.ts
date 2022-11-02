import { providers } from "ethers";
import { Sich } from "..";
import { ISichRecord } from "../interfaces";

export async function onReceiptProcess(
  this: Sich, 
  receipt: providers.TransactionReceipt, 
  record_id: string
) {

  if(receipt && receipt.status) {
    const gas_used = receipt.gasUsed.toNumber();
    await this.adapter.onSuccess(record_id, gas_used);
  } else { // if revert
    throw new Error('Transaction reverted');
  }
}