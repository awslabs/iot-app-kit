import {
  isHistoricalViewport,
  parseDuration,
  viewportEndDate,
  viewportStartDate,
} from '@iot-app-kit/core';
import {
  asComparable as liveDataComparable,
  LiveDataInterval,
} from './liveDataIntervals';
import {
  GetAssetPropertyValueHistoryDataRequest,
  TimeSeriesRequestViewport,
} from './types';
import {
  asComparable as viewportComparable,
  compare,
  startsBefore,
  endsAfter,
  asComparable,
} from './viewportUtils';

export const splitViewportIntoStaticAndLiveIntervals = (
  viewport: TimeSeriesRequestViewport,
  liveDataIntervals: LiveDataInterval[]
) => {
  const liveDataIntervalCutoff = liveDataIntervals.sort(compare).at(0);

  const { startDate, endDate } = viewportComparable(viewport);
  const liveDataIntervalCutoffTime = liveDataComparable(liveDataIntervalCutoff);

  let staticDataInterval = undefined;
  let liveDataInterval = undefined;

  if (startDate < liveDataIntervalCutoffTime) {
    staticDataInterval = isHistoricalViewport(viewport)
      ? {
          ...viewport,
          end: new Date(Math.min(endDate, liveDataIntervalCutoffTime)),
        }
      : {
          ...viewport,
          startOffset: endDate - liveDataIntervalCutoffTime,
          duration:
            parseDuration(viewport.duration) -
            (endDate - liveDataIntervalCutoffTime),
        };
  }

  if (endDate > liveDataIntervalCutoffTime) {
    liveDataInterval = isHistoricalViewport(viewport)
      ? {
          ...viewport,
          start: new Date(Math.max(startDate, liveDataIntervalCutoffTime)),
        }
      : {
          ...viewport,
          startOffset: 0,
          duration:
            endDate -
            (startDate > liveDataIntervalCutoffTime
              ? startDate
              : liveDataIntervalCutoffTime),
        };
  }

  return {
    staticDataInterval,
    liveDataInterval,
  };
};

const compareRequest = (
  a: GetAssetPropertyValueHistoryDataRequest,
  b: GetAssetPropertyValueHistoryDataRequest
) => compare(a.viewport, b.viewport);

export const completeStaticRequests = (
  request: GetAssetPropertyValueHistoryDataRequest,
  requestsContext: GetAssetPropertyValueHistoryDataRequest[]
): GetAssetPropertyValueHistoryDataRequest[] => {
  if (requestsContext.length === 0) {
    return [request];
  }

  const sortedContext = requestsContext.sort(compareRequest);

  const queryRequests = [];

  // fill in first
  const firstRequest = sortedContext.at(0);
  if (firstRequest && startsBefore(request.viewport, firstRequest.viewport)) {
    queryRequests.push({
      ...request,
      viewport: {
        start: viewportStartDate(request.viewport),
        end: viewportStartDate(firstRequest.viewport),
      },
    });
  }

  // fill in existing
  queryRequests.push(...sortedContext);

  // fill in last
  const lastRequest = sortedContext.at(-1);
  if (lastRequest && endsAfter(request.viewport, lastRequest.viewport)) {
    queryRequests.push({
      ...request,
      viewport: {
        start: viewportEndDate(lastRequest.viewport),
        end: viewportEndDate(request.viewport),
      },
    });
  }

  const missingQueryRequests = [];

  // fill in holes
  for (let i = 1; i < queryRequests.length; i++) {
    const lastKey = queryRequests[i - 1];
    const currentKey = queryRequests[i];

    if (
      viewportEndDate(lastKey.viewport) < viewportStartDate(currentKey.viewport)
    ) {
      missingQueryRequests.push({
        ...request,
        viewport: {
          start: viewportEndDate(lastKey.viewport),
          end: viewportStartDate(currentKey.viewport),
        },
      });
    }
  }

  return [...queryRequests, ...missingQueryRequests].sort(compareRequest);
};

export const collapseRequests = (
  requests: GetAssetPropertyValueHistoryDataRequest[]
) => {
  if (requests.length === 0) return requests;

  const sortedRequests = requests.sort(compareRequest);

  const collapsed: GetAssetPropertyValueHistoryDataRequest[] = [];

  collapsed.push(sortedRequests[0]);

  for (let i = 1; i < sortedRequests.length; i++) {
    // get interval from stack top
    const top = collapsed[collapsed.length - 1];
    const current = sortedRequests[i];

    const { endDate: topEndDate } = asComparable(top.viewport);

    const { startDate: currentStartDate, endDate: currentEndDate } =
      asComparable(current.viewport);

    // if current interval is not overlapping with stack
    // top, push it to the stack
    if (topEndDate < currentStartDate) {
      collapsed.push(current);
    } else if (topEndDate < currentEndDate) {
      collapsed.pop();
      collapsed.push({
        ...top,
        viewport: isHistoricalViewport(top.viewport)
          ? {
              ...top.viewport,
              end: new Date(currentEndDate),
            }
          : {
              ...top.viewport,
              startOffset: currentEndDate,
              duration:
                parseDuration(top.viewport.duration) +
                (currentEndDate - (top.viewport?.startOffset ?? 0)),
            },
      });
    }
  }

  return collapsed.sort(compareRequest);
};
