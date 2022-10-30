import { SichRecord } from "./adapter/sich-record"
import { ISichNetwork, ISichOpts, ISichStorageAdapter, SichContractGetter, SichJobArg } from "./interfaces";
import { providers, Contract } from "ethers";
import { callJob } from "./methods/call-job";
import { processRecord } from "./methods/process-record";
import { processAllRecords } from "./methods/process-all-records";
import { estimateJobGas } from "./methods/estimate-job-gas";
import { getGasPrice } from "./methods/get-gas-price";
import { onReceiptProcess } from "./methods/on-receipt-process";
import { addNetwork } from "./methods/add-network";

export class Sich {

  protected adapter: ISichStorageAdapter;
  protected contractsGetter: SichContractGetter;
  protected loop_interval: number;
  protected max_errors_count: number;

  protected networks: ISichNetwork[] = [];

  protected fee_data = {
    price: '',
    expire_at: new Date(0),
  }

  constructor(adapter: ISichStorageAdapter, opts: ISichOpts) {
    const {
      contractsGetter,
      loop_interval = 5000,
      max_errors_count = 5,
    } = opts;
  
    if(!contractsGetter) {
      throw new Error('contractsGetter is required');
    }

    if(!adapter.isSichAdapter || !adapter.isSichAdapter()) {
      throw new Error('adapter is not a SichAdapter');
    }
  
    this.adapter = adapter;
    this.contractsGetter = contractsGetter;
    this.loop_interval = loop_interval;
    this.max_errors_count = max_errors_count;
  }

  public addNetwork = addNetwork;
  public estimateJobGas = estimateJobGas;
  public callJob = callJob;
  public processRecord = processRecord;
  public processAllRecords = processAllRecords;
  public getGasPrice = getGasPrice;
  public onReceiptProcess = onReceiptProcess;

  start(): void {
    this.mainLoop();
  }

  private async mainLoop(): Promise<void> {
    
    await Promise.all([
      this.processAllRecords(),
      new Promise(resolve => setTimeout(resolve, this.loop_interval)),
    ]);

    this.mainLoop();

  }
}