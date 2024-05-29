import {
  IntervalTransformer,
  getViewportType,
  divideInterval,
  requestRange,
} from '../intervals';
import { Viewport } from '../types';
import {
  ResolveOptions,
  TimeSeriesDataRequestResolver,
} from './requestResolver';
import { RequestSettings } from './types';

export class AbsoluteDurationTimeSeriesDataRequestResolver<
  Request,
  Data
> extends TimeSeriesDataRequestResolver<Request, Data> {
  resolveViewports(
    { request, viewport, now }: ResolveOptions<Request>,
    settings?: RequestSettings
  ): Viewport[] {
    const intervalTransformer = new IntervalTransformer({
      now,
      viewportType: getViewportType(viewport),
    });

    const interval = intervalTransformer.toInterval(viewport);

    const existingRequestIntervals =
      this.cacheClient.getCachedTimeSeriesDataRequestIntervals(request);

    const resolvedRequestRange = requestRange(
      {
        ...interval,
        max: new Date(now),
      },
      settings?.requestBuffer
    );

    const missingIntervals = divideInterval(
      resolvedRequestRange,
      existingRequestIntervals
    );

    return missingIntervals.map((interval) =>
      intervalTransformer.toViewport(interval)
    );
  }
}
