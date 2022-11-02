import { Sich } from "..";
import { parseArgsToString } from "../helpers";
import { SichJobArg } from "../interfaces";

interface CallJobOpts {
  contract_name: string;
  method: string;
  args: SichJobArg[];
  id: string;
  fee_max_cap?: number;
  network: string;
}

export async function callJob(
  this: Sich,
  opts: CallJobOpts,
): Promise<void> {
  const record = await this.adapter.retrieveRecordById(opts.id);

  opts.args = parseArgsToString(JSON.parse(JSON.stringify(opts.args)));

  if(record && record.is_killed) {
    await this.adapter.renewKilledRecord(opts.id);
  }
  else if(record && record.is_successful) {
    // ignore ?
  }
  else {
    await this.adapter.newRecord(
      opts.id, 
      opts.contract_name, 
      opts.method, 
      opts.args, 
      opts.network,
      opts.fee_max_cap
    );
  }
}