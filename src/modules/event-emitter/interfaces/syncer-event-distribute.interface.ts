export interface ISyncerEventDistributeWithPayload {
  name: string;
  payload: any;
  metadata?: any;
  id: string;
}


export interface ISyncerEventDistributeWithArgs {
  name: string;
  args: any;
  metadata?: any;
  id: string;
}