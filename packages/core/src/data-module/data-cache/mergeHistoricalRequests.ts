import type { HistoricalRequest } from './types';

/**
 * returns the historical requests after merged.
 */
const mergeHistoricalRequest = (
  newRequest: HistoricalRequest,
  existingRequest: HistoricalRequest
): HistoricalRequest[] => {
  if (
    newRequest.start <= existingRequest.start &&
    newRequest.end >= existingRequest.end
  ) {
    // new request fully contains existing request.
    return [];
  }
  if (
    newRequest.start >= existingRequest.start &&
    newRequest.end <= existingRequest.end
  ) {
    // new request fully contained within existing request
    return [
      {
        start: existingRequest.start,
        end: newRequest.start,
        requestedAt: existingRequest.requestedAt,
      },
      {
        start: newRequest.start,
        end: existingRequest.end,
        requestedAt: existingRequest.requestedAt,
      },
    ];
  }

  if (
    newRequest.start < existingRequest.start &&
    newRequest.end > existingRequest.start
  ) {
    // new request overlaps on the left side
    return [
      {
        start: newRequest.end,
        end: existingRequest.end,
        requestedAt: existingRequest.requestedAt,
      },
    ];
  }

  if (
    existingRequest.start < newRequest.start &&
    existingRequest.end > newRequest.start
  ) {
    // new request overlaps on the right side
    return [
      {
        start: existingRequest.start,
        end: newRequest.start,
        requestedAt: existingRequest.requestedAt,
      },
    ];
  }

  // non-overlapping
  return [existingRequest];
};

const chronologicalSort = (
  r1: HistoricalRequest,
  r2: HistoricalRequest
): number => r2.start.getTime() - r1.start.getTime();

/**
 * Merge Historical Requests
 *
 * Appends a historical request while maintaing the following variants:
 * 1. all historical requests are disjoint, i.e. there are not two historical requests which overlap
 * 2. A new historical request added will always be present unaltered
 */
export const mergeHistoricalRequests = (
  existingHistory: HistoricalRequest[],
  newRequest: HistoricalRequest
): HistoricalRequest[] =>
  [
    newRequest,
    ...existingHistory.map((r) => mergeHistoricalRequest(newRequest, r)).flat(),
  ].sort(chronologicalSort);
