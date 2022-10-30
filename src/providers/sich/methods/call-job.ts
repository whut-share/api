import { Sich } from "..";
import { SichJobArg } from "../interfaces";

export async function callJob(
  this: Sich,
  job_key: string, 
  id: string, 
  fee_max_cap: number, 
  args: SichJobArg[]
): Promise<void> {
  
}