import { isBefore } from 'date-fns';
import {
  IntervalTransformer,
  overlaps,
  sortIntervals,
  requestRange,
} from '../intervals';
import { Viewport } from '../types';
import {
  RequestResolverOptions,
  ResolveOptions,
  TimeSeriesDataRequestResolver,
} from './requestResolver';
import { RequestSettings } from './types';

export type LiveDurationTimeSeriesDataRequestResolverOptions<Request, Data> =
  RequestResolverOptions<Request, Data> & {
    liveDataIntervals: Viewport[];
  };

export class LiveDurationTimeSeriesDataRequestResolver<
  Request,
  Data
> extends TimeSeriesDataRequestResolver<Request, Data> {
  #liveDataIntervals: Viewport[];

  constructor({
    liveDataIntervals,
    ...options
  }: LiveDurationTimeSeriesDataRequestResolverOptions<Request, Data>) {
    super(options);
    this.#liveDataIntervals = liveDataIntervals;
  }

  resolveViewports(
    { viewport, now }: ResolveOptions<Request>,
    settings?: RequestSettings
  ): Viewport[] {
    const intervalTransformer = new IntervalTransformer({
      now,
      viewportType: 'duration',
    });

    const interval = intervalTransformer.toInterval(viewport);

    const liveDataIntervals = this.#liveDataIntervals.map((viewport) =>
      intervalTransformer.toInterval(viewport)
    );

    const resolvedRequestRange = requestRange(
      {
        ...interval,
        max: new Date(now),
      },
      settings?.requestBuffer
    );

    const sortedLiveDataIntervals = sortIntervals([...liveDataIntervals]);

    // interval furthest from the current time
    const firstInterval = sortedLiveDataIntervals.at(0);

    let constrainedIntervals = [...sortedLiveDataIntervals];

    /**
     * if the request range is not fully covered by live data intervals
     * add in a starting interval
     */
    if (
      firstInterval &&
      isBefore(resolvedRequestRange.start, firstInterval.start)
    ) {
      constrainedIntervals.unshift({
        start: resolvedRequestRange.start,
        end: firstInterval.start,
      });
    }

    /**
     * if the request range is before the current time
     * it means we are not in live mode, and
     * we can filter out any live data intervals
     * that don't apply to this viewport
     */
    if (isBefore(resolvedRequestRange.end, new Date(now))) {
      constrainedIntervals = [...constrainedIntervals].filter(
        overlaps(resolvedRequestRange)
      );
    }

    return constrainedIntervals.map((interval) =>
      intervalTransformer.toViewport(interval)
    );
  }
}
