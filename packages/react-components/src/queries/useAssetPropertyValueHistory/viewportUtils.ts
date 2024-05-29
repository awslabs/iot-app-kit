import { viewportEndDate, viewportStartDate } from '@iot-app-kit/core';
import { TimeSeriesRequestViewport } from './types';

const getStartOffset = (viewport: TimeSeriesRequestViewport) =>
  viewport.startOffset
    ? new Date(Date.now() - viewport.startOffset)
    : undefined;

export const asHistoricalViewport = (viewport: TimeSeriesRequestViewport) => ({
  startDate: viewportStartDate(viewport, getStartOffset(viewport)),
  endDate: viewportEndDate(viewport, getStartOffset(viewport)),
});

export const asComparable = (viewport: TimeSeriesRequestViewport) => {
  const { startDate, endDate } = asHistoricalViewport(viewport);
  return {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
  };
};

export const compare = (
  a: TimeSeriesRequestViewport,
  b: TimeSeriesRequestViewport
) => asComparable(a).startDate - asComparable(b).startDate;

export const containsStart = (
  a: TimeSeriesRequestViewport,
  b: TimeSeriesRequestViewport
) => {
  const { startDate: startDateA, endDate: endDateA } = asComparable(a);
  const { startDate: startDateB } = asComparable(b);

  return startDateB >= startDateA && startDateB <= endDateA;
};

export const containsEnd = (
  a: TimeSeriesRequestViewport,
  b: TimeSeriesRequestViewport
) => {
  const { startDate: startDateA, endDate: endDateA } = asComparable(a);
  const { endDate: endDateB } = asComparable(b);

  return endDateB >= startDateA && endDateB <= endDateA;
};

export const covers = (
  a: TimeSeriesRequestViewport,
  b: TimeSeriesRequestViewport
) => {
  const { startDate: startDateA, endDate: endDateA } = asComparable(a);
  const { startDate: startDateB, endDate: endDateB } = asComparable(b);

  return startDateB <= startDateA && endDateB >= endDateA;
};

export const isInViewport =
  (requestViewport: TimeSeriesRequestViewport) =>
  (viewport: TimeSeriesRequestViewport) =>
    containsStart(requestViewport, viewport) ||
    containsEnd(requestViewport, viewport) ||
    covers(requestViewport, viewport);

export const startsBefore = (
  a: TimeSeriesRequestViewport,
  b: TimeSeriesRequestViewport
) => {
  return viewportStartDate(a).getTime() < viewportStartDate(b).getTime();
};
export const endsAfter = (
  a: TimeSeriesRequestViewport,
  b: TimeSeriesRequestViewport
) => {
  return viewportEndDate(a).getTime() > viewportEndDate(b).getTime();
};
