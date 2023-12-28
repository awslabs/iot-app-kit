import { SECOND_IN_MS } from '@iot-app-kit/core';

export const RAW_DATA_RECENCY_THRESHOLD = 10; // in seconds

/**
 * Whether the given date is within the threshold to consider as a end date for a latest property request.
 * @param date the date to consider
 * @returns Whether the given date is within the threshold
 */
export const withinLatestPropertyDataThreshold = (date: Date) =>
  Date.now() - date.getTime() < RAW_DATA_RECENCY_THRESHOLD * SECOND_IN_MS;
