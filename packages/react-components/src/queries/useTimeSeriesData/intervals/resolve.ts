import { Viewport } from '../types';
import {
  IntervalTransformer,
  collapse,
  complete,
  constrain,
  overlaps,
} from './utils';

type ResolveOptions = {
  viewport: Viewport;
  existingViewports: Viewport[];
  liveDataViewports: Viewport[];
  intervalTransformer: IntervalTransformer;
};

export const resolve = ({
  viewport,
  existingViewports,
  liveDataViewports,
  intervalTransformer,
}: ResolveOptions) => {
  const targetInterval = intervalTransformer.toInterval(viewport);
  const existingIntervals = existingViewports.map((interval) =>
    intervalTransformer.toInterval(interval)
  );
  const liveDataIntervals = liveDataViewports.map((interval) =>
    intervalTransformer.toInterval(interval)
  );

  // combine overlapping intervals with the same refresh rate
  // to reduce number of discrete viewports to request
  const collapsedExistingIntervals = collapse([
    ...existingIntervals,
    ...liveDataIntervals,
  ]);

  // ensure that the list of intervals covers the target interval start and end dates
  // maybe there is a better name for this?
  const constrainedIntervals = constrain(
    targetInterval,
    collapsedExistingIntervals
  );

  // fill in any interior holes in the list of intervals
  const completedIntervals = complete(constrainedIntervals);

  /**
   * remove intervals that are outside of the target viewport
   * This can happen if existing intervals don't apply or
   * the live data intervals don't apply
   */
  const intervalsOverlappingTarget = completedIntervals.filter(
    overlaps(targetInterval)
  );

  return intervalsOverlappingTarget.map((interval) =>
    intervalTransformer.toViewport(interval)
  );
};
