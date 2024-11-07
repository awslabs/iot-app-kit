import { type Interval } from '../types';

export type SendOptions<Request> = {
  request: Request;
  interval: Interval;
  signal: AbortSignal;
};
