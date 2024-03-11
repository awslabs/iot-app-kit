import {
  DataPoint,
  DataStream,
  DataType,
  RequestSettings,
  TimeSeriesDataQuery,
  Viewport,
} from '@iot-app-kit/core';
import { v4 as uuid } from 'uuid';
import parse from 'parse-duration';

type MockRequest = {
  name: string;
  createDataPoint: (date: Date) => DataPoint;
  detailedName?: string;
  color?: string;
  dataType?: DataType;
  resolution?: number;
};

const noop = () => {};
export const mockTimeSeriesDataQueryLiveStream = ({
  requests,
  dataType,
  frequency = '1s',
  overrides,
}: {
  requests: MockRequest[];
  dataType: DataType;
  frequency?: string; // see https://www.npmjs.com/package/parse-duration for valid values, ex '1m', '1hr'
  overrides?: {
    updateViewport?: (viewport: Viewport) => void;
    unsubscribe?: () => void;
  };
}): TimeSeriesDataQuery => {
  const { updateViewport = noop, unsubscribe = noop } = overrides || {};

  const id = uuid();
  let dataStreams: DataStream[] = requests.map(
    ({ createDataPoint: _, name, ...rest }, i) => {
      return {
        id: name,
        name,
        color: 'black',
        isLoading: true,
        dataType,
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
          pushDataHandler = setInterval(() => addData(), parse(frequency));
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
    getRequestSettings: () => {
      return {} as RequestSettings;
    },
  };
};

export const mockTimeSeriesDataQueryLiveStreamAggregated = ({
  requests,
  resolution,
  dataType,
  frequency = '1s',
  overrides,
}: {
  requests: MockRequest[];
  resolution: number;
  dataType: DataType;
  frequency?: string; // see https://www.npmjs.com/package/parse-duration for valid values, ex '1m', '1hr'
  overrides?: {
    updateViewport?: (viewport: Viewport) => void;
    unsubscribe?: () => void;
  };
}): TimeSeriesDataQuery => {
  const { updateViewport = noop, unsubscribe = noop } = overrides || {};

  const id = uuid();
  let dataStreams: DataStream[] = requests.map(
    ({ createDataPoint: _, name, ...rest }, i) => {
      return {
        id: name,
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

          // At the requested frequency, create new data point in every data stream according to the provided `createDataPoint` method
          pushDataHandler = setInterval(() => addData(), parse(frequency));
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
    getRequestSettings: () => {
      return {} as RequestSettings;
    },
  };
};
