import { TimeSeriesDataCacheClient } from '../cacheClient';
import { IntervalTransformer, getViewportType } from '../intervals';
import { Viewport } from '../types';
import { RequestResolverStrategy, RequestSettings } from './types';

export type ResolveOptions<Request> = {
  request: Request;
  viewport: Viewport;
  now: number;
};

export type RequestResolverOptions<Request, Data> = {
  cacheClient: TimeSeriesDataCacheClient<Request, Data>;
};

export abstract class TimeSeriesDataRequestResolver<Request, Data>
  implements RequestResolverStrategy<Request>
{
  protected cacheClient: TimeSeriesDataCacheClient<Request, Data>;

  constructor({ cacheClient }: RequestResolverOptions<Request, Data>) {
    this.cacheClient = cacheClient;
  }

  abstract resolveViewports(
    { viewport, now }: ResolveOptions<Request>,
    settings?: RequestSettings
  ): Viewport[];

  resolve(
    { request, viewport }: { request: Request; viewport: Viewport },
    settings?: RequestSettings
  ): { request: Request; viewport: Viewport }[] {
    const viewportType = getViewportType(viewport);
    const now = Date.now();

    const intervalTransformer = new IntervalTransformer({
      now,
      viewportType,
    });

    this.cacheClient.cancelTimeSeriesDataRequests(
      { request, viewport },
      { intervalTransformer, status: 'pending' }
    );

    const resolvedIViewports = this.resolveViewports(
      { request, viewport, now },
      settings
    );

    return resolvedIViewports.map((v) => ({
      request,
      viewport: v,
    }));
  }
}
