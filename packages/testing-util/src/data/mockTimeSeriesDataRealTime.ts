import type {
  DataPoint,
  DataStream,
  DataType,
  TimeSeriesDataQuery,
  Viewport,
} from '@iot-app-kit/core';
import { v4 as uuid } from 'uuid';

type MockRequest = {
  name: string;
  createDataPoint: (date: Date) => DataPoint;
  detailedName?: string;
  color?: string;
  dataType?: DataType;
  resolution?: number;
  unit?: string;
};

const noop = () => {};
export const mockTimeSeriesDataQueryLiveStream = ({
  requests,
  dataType,
  refreshRate = 1000, // milliseconds
  overrides,
}: {
  requests: MockRequest[];
  dataType: DataType;
  refreshRate?: number;
  overrides?: {
    updateViewport?: (viewport: Viewport) => void;
    unsubscribe?: () => void;
  };
}): TimeSeriesDataQuery => {
  const { updateViewport = noop, unsubscribe = noop } = overrides || {};

  const id = uuid();
  let dataStreams: DataStream[] = requests.map(
    ({ createDataPoint: _, name, unit, ...rest }, i) => {
      return {
        id: name,
        name,
        color: 'black',
        isLoading: true,
        dataType,
        unit,
        data: [requests[i].createDataPoint(new Date())],
        resolution: 0,
        ...rest,
      };
    }
  );
  return {
    toQueryString: () =>
      JSON.stringify({
        source: 'mock',
        query: `live-data-stream-${id}`,
      }),
    build: () => {
      let pushDataHandler: NodeJS.Timer | undefined = undefined;
      return {
        subscribe: ({ next }) => {
          next([
            {
              dataStreams,
              thresholds: [],
              viewport: { duration: '5m' },
            },
          ]);
          const addData = () => {
            dataStreams = dataStreams.map((dataStream, i) => ({
              ...dataStream,
              isLoading: false,
              data: [
                ...dataStream.data,
                requests[i].createDataPoint(new Date()),
              ],
            }));

            next([
              {
                dataStreams,
                thresholds: [],
                viewport: { duration: '5m' },
              },
            ]);
          };

          // At the requested frequency, create new data point in every data stream according to the provided `createDataPoint` method
          pushDataHandler = setInterval(() => addData(), refreshRate);
        },
        unsubscribe: () => {
          unsubscribe();
          if (pushDataHandler != null) {
            clearInterval(pushDataHandler);
          }
        },
        updateViewport: (viewport) => {
          updateViewport(viewport);
        },
      };
    },
  };
};

export const mockTimeSeriesDataQueryLiveStreamAggregated = ({
  requests,
  resolution,
  dataType,
  refreshRate = 1000, // milliseconds
  overrides,
  id = uuid(),
}: {
  requests: MockRequest[];
  resolution: number;
  dataType: DataType;
  refreshRate?: number;
  overrides?: {
    updateViewport?: (viewport: Viewport) => void;
    unsubscribe?: () => void;
  };
  id?: string;
}): TimeSeriesDataQuery => {
  const { updateViewport = noop, unsubscribe = noop } = overrides || {};

  let dataStreams: DataStream[] = requests.map(
    ({ createDataPoint: _, name, ...rest }, i) => {
      return {
        id,
        name,
        color: 'black',
        isLoading: true,
        dataType,
        data: [requests[i].createDataPoint(new Date())],
        resolution,
        ...rest,
      };
    }
  );
  return {
    toQueryString: () =>
      JSON.stringify({
        source: 'mock',
        query: `live-data-stream-${id}`,
      }),
    build: () => {
      let pushDataHandler: NodeJS.Timer | undefined = undefined;
      return {
        subscribe: ({ next }) => {
          next([
            {
              dataStreams,
              thresholds: [],
              viewport: { duration: '5m' },
            },
          ]);
          const addData = () => {
            dataStreams = dataStreams.map((dataStream, i) => ({
              ...dataStream,
              isLoading: false,
              data: [
                ...dataStream.data,
                requests[i].createDataPoint(new Date()),
              ],
            }));

            next([
              {
                dataStreams,
                thresholds: [],
                viewport: { duration: '5m' },
              },
            ]);
          };

          // At the requested refreshRate, create new data point in every data stream according to the provided `createDataPoint` method
          pushDataHandler = setInterval(() => addData(), refreshRate);
        },
        unsubscribe: () => {
          unsubscribe();
          if (pushDataHandler != null) {
            clearInterval(pushDataHandler);
          }
        },
        updateViewport: (viewport) => {
          updateViewport(viewport);
        },
      };
    },
  };
};
