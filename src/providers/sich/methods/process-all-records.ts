import { Sich } from "..";
import { ISichRecord } from "../interfaces";

export async function processAllRecords(this: Sich): Promise<void> {
  const records = await this.adapter.selectAllPendingRecords();

  let processed = 0;
  for (const record of records) {
    console.log('Starting TX');
    await this.processRecord(record)
      .then(() => processed++)
      .catch(async err => {

        console.error('[SICH] Error while processing record:', err.message);

        const network = this.networks.find(n => n.key === record.network);

        const hidden_till = new Date(Date.now() + (record.errors_count * (network.block_time * 5)));

        if(record.errors_count >= this.max_errors_count) {
          await this.adapter.killRecord(record.id);
        } else {
          await this.adapter.onError(record.id, hidden_till);
        }
      })
  }

  if(records.length) {
    console.log('[SICH]', processed, 'processed');
  }
}