import { TwinMakerTimeSeriesDataProvider } from './provider';
import { TimeSeriesDataModule } from '@iot-app-kit/core';
import { createDataSource } from './data-source';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { MINUTE_IN_MS } from '../common/timeConstants';
import type { TwinMakerDataStreamQuery } from './types';

import flushPromises from 'flush-promises';

const tmClient = new IoTTwinMakerClient({});
const metadataModule = new TwinMakerMetadataModule('ws-1', tmClient);
const timeSeriesModule = new TimeSeriesDataModule<TwinMakerDataStreamQuery>(createDataSource(metadataModule, tmClient));

it('should subscribes, updates, and unsubscribes to time series data', async () => {
  const START_1 = new Date(2020, 0, 0);
  const END_1 = new Date();
  const refreshRate = MINUTE_IN_MS;

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

  await flushPromises();

  expect(timeSeriesCallback).toBeCalledWith([
    {
      thresholds: [],
      dataStreams: [
        {
          aggregates: {},
          data: [],
          id: '{"componentName":"comp-1","entityId":"entity-1","propertyName":"prop-1","workspaceId":"ws-1"}',
          isLoading: true,
          isRefreshing: false,
          refId: undefined,
          resolution: 0,
        },
      ],
      viewport: { start: START_1, end: END_1 },
    },
  ]);

  // update
  const START_2 = new Date(2019, 0, 0);
  const END_2 = new Date();

  const subscriptionUpdate = {
    request: { viewport: { start: START_2, end: END_2 } },
  };
  provider.updateSubscription(subscriptionUpdate);

  // update viewport
  const START_3 = new Date(2018, 0, 0);
  const END_3 = new Date();

  provider.updateViewport({
    start: START_3,
    end: END_3,
  });

  // unsubscribe
  provider.unsubscribe();
});
