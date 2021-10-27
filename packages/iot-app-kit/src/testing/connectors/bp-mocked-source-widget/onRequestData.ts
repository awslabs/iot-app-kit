import { DataPoint, DataStream, DataType, ViewPort } from '@synchro-charts/core';
import { OnRequestData } from '../../../data-module/data-cache/requestTypes';
import { DAY_IN_MS, HOUR_IN_MS, MINUTE_IN_MS, MONTH_IN_MS, SECOND_IN_MS, YEAR_IN_MS } from '../../../utils/time';
import { DATA_STREAM_ID_WITH_STRING } from '../../monitor-demo/testConfigs';

export const SUPPORTED_RESOLUTIONS = [0, MINUTE_IN_MS, HOUR_IN_MS, DAY_IN_MS, MONTH_IN_MS, YEAR_IN_MS];

/**
 * A simple `OnRequestData` implementation which allows for hard coded in memory handling of the data.
 * Possibly useful for developers to utilize in testing.
 */

type CreateOnRequestData = ({ error }: { error: boolean }) => OnRequestData;

const LATENCY_MS = SECOND_IN_MS;

const getY = (x: number, duration: number): number =>
  Math.sin(x / (duration * 8)) * 5 +
  (Math.random() * 3) ** 2 +
  Math.log(x) +
  100 +
  Math.random() / 10 +
  Math.random() / 100 +
  Math.random() / 1000;

const truncateDate = (num: number): number => Math.floor(num / DAY_IN_MS) * DAY_IN_MS;

const getRandomData = ({
  start,
  end,
  streamId,
  resolution,
}: {
  start: Date;
  end: Date;
  streamId: string;
  resolution: number;
}): DataStream => {
  let xMs = truncateDate(start.getTime());
  const dataPoints: DataPoint[] = [];
  const STRING_DATA_POINTS = ['UP', 'DOWN', 'CENTER', '1'];

  while (xMs <= end.getTime()) {
    xMs += resolution;
    if (Math.random() >= 0.1) {
      const y =
        streamId === DATA_STREAM_ID_WITH_STRING
          ? STRING_DATA_POINTS[Math.floor(Math.random() * STRING_DATA_POINTS.length)]
          : getY(xMs, resolution);
      dataPoints.push({
        x: truncateDate(xMs),
        y,
      });
    }
  }

  return {
    id: streamId,
    name: streamId,
    resolution,
    data: [],
    aggregates: {
      [resolution]: dataPoints,
    },
    dataType: streamId === DATA_STREAM_ID_WITH_STRING ? DataType.STRING : DataType.NUMBER,
  };
};

export const createOnRequestData: CreateOnRequestData = ({ error }: { error: boolean }) => ({
  onError,
  resolution,
  onSuccess,
  request,
  dataStreamId: id,
}): void => {
  setTimeout(() => {
    // Determine the resolution to aggregate the request at
    if (!error) {
      const start =
        'duration' in request && request.duration != null
          ? new Date(Date.now() - request.duration)
          : ((request as unknown) as ViewPort).start;
      const end =
        'duration' in request && request.duration != null ? new Date() : ((request as unknown) as ViewPort).end;

      const stream = getRandomData({ resolution, streamId: id, start, end });
      onSuccess(id, stream, start, end);
    } else {
      onError(id, resolution, 'always throw error mode is on! expected error');
    }
  }, LATENCY_MS);
};
