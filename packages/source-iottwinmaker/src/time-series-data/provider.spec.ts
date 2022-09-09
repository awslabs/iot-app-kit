import { TwinMakerTimeSeriesDataProvider } from './provider';
import { MINUTE_IN_MS, TimeSeriesData, TimeSeriesDataModule } from '@iot-app-kit/core';
import { createDataSource } from './data-source';
import * as helper from './subscribeToTimeSeriesData';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { TwinMakerDataStreamQuery } from './types';

const tmClient = new IoTTwinMakerClient({});
const metadataModule = new TwinMakerMetadataModule('ws-1', tmClient);
const timeSeriesModule = new TimeSeriesDataModule<TwinMakerDataStreamQuery>(createDataSource(metadataModule, tmClient));

it('should subscribes, updates, and unsubscribes to time series data', () => {
  const START_1 = new Date(2020, 0, 0);
  const END_1 = new Date();
  const refreshRate = MINUTE_IN_MS;
  const mockTimeSeriesData: TimeSeriesData = {
    dataStreams: [{ id: '123', data: [], resolution: 0 }],
    viewport: { start: START_1, end: END_1 },
  };
  const mockUpdate = jest.fn();
  const mockUnsubscribe = jest.fn();
  const subscribeSpy = jest.spyOn(helper, 'subscribeToTimeSeriesData').mockReturnValue((input, cb) => {
    cb(mockTimeSeriesData);
    return { update: mockUpdate, unsubscribe: mockUnsubscribe };
  });

  const provider = new TwinMakerTimeSeriesDataProvider(metadataModule, timeSeriesModule, {
    queries: [
      {
        workspaceId: 'ws-1',
        entityId: 'entity-1',
        componentName: 'comp-1',
        properties: [{ propertyName: 'prop-1' }],
      },
    ],
    request: {
      viewport: { start: START_1, end: END_1 },
      settings: { fetchFromStartToEnd: true, refreshRate },
    },
  });

  const timeSeriesCallback = jest.fn();

  // subscribe
  provider.subscribe({ next: timeSeriesCallback });

  expect(subscribeSpy).toBeCalledTimes(1);
  expect(timeSeriesCallback).toBeCalledWith([mockTimeSeriesData]);

  // update
  const START_2 = new Date(2019, 0, 0);
  const END_2 = new Date();

  const subscriptionUpdate = {
    request: { viewport: { start: START_2, end: END_2 } },
  };
  provider.updateSubscription(subscriptionUpdate);

  expect(mockUpdate).toBeCalledWith(subscriptionUpdate);

  mockUpdate.mockClear();

  // update viewport
  const START_3 = new Date(2018, 0, 0);
  const END_3 = new Date();

  provider.updateViewport({
    start: START_3,
    end: END_3,
  });

  expect(mockUpdate).toBeCalledWith({
    request: {
      settings: { fetchFromStartToEnd: true, refreshRate },
      viewport: {
        start: START_3,
        end: END_3,
      },
    },
  });

  // unsubscribe
  provider.unsubscribe();

  expect(mockUnsubscribe).toBeCalled();
});
