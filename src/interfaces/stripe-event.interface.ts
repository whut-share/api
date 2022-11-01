export interface IStripeEvent<T> {
  evt_id: string;
  data: T
}