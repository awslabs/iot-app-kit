import { Viewport } from '../types';

export type RequestSettings = {
  requestBuffer?: number;
  fetchMostRecentBeforeEnd?: boolean;
  fetchMostRecentBeforeStart?: boolean;
};

export interface RequestResolverStrategy<Request> {
  resolve(
    { request, viewport }: { request: Request; viewport: Viewport },
    settings?: RequestSettings
  ): { request: Request; viewport: Viewport }[];
}
