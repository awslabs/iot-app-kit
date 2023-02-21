import { DataStreamInfo } from '@synchro-charts/core';
import { isHistoricalViewport } from '../../common/predicates';
import { MINUTE_IN_MS } from '../../common/time';
import { Viewport } from './requestTypes';

// TODO: Parameter can be passed in as a setting to make it customizable
const SITE_WISE_MAX_AGE_OF_DATA = 15 * MINUTE_IN_MS;

export const shouldImmediatelyCallRequest = (
  prevDataStreamInfo: DataStreamInfo[] | undefined,
  newDataStreamInfo: DataStreamInfo[],
  viewport: Viewport
): boolean => {
  if (newDataStreamInfo.length === 0) {
    // There is no data to request if you have no data stream infos.
    return false;
  }

  const prevStreamIds = prevDataStreamInfo ? prevDataStreamInfo.map(({ id }) => id) : [];
  const newStreamIds = newDataStreamInfo.map(({ id }) => id);

  const hasNewStreamId = newStreamIds.some((id) => !prevStreamIds.includes(id));
  const isWithinStaleDataRange = isHistoricalViewport(viewport)
    ? (viewport.end as Date) >= new Date(Date.now() - SITE_WISE_MAX_AGE_OF_DATA)
    : true;

  return hasNewStreamId || !isWithinStaleDataRange;
};
