import { describeTimeSeriesHandler } from '~/msw/iot-sitewise/handlers/describeTimeSeries/describeTimeSeries';
import { server } from '~/msw/server';
import { useViewportData } from './useViewportData';
import { useTimeSeriesData } from '@iot-app-kit/react-components';
import { renderHook, waitFor } from '@testing-library/react';
import {
  StyledAssetQuery,
  StyledSiteWiseQueryConfig,
} from '~/customization/widgets/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { DataStream } from '@iot-app-kit/core';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

const ASSET_ID_1 = 'some-asset-id-1';
const PROPERTY_ID_1 = 'some-property-id-1';
const PROPERTY_ID_2 = 'some-property-id-2';
const ALIAS_1 = '/aws/windfarm/0/turbine/0/temperature';

const MOCK_QUERY: StyledAssetQuery = {
  assets: [
    { assetId: ASSET_ID_1, properties: [{ propertyId: PROPERTY_ID_1 }] },
  ],
  properties: [{ propertyAlias: ALIAS_1 }],
};

const MOCK_QUERY_CLIENT = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const DATA_POINT_1 = { x: 1699555901783, y: 23.59 };
const DATA_POINT_2 = { x: 1699554901883, y: 23.59 };
const DATA_POINT_3 = { x: 1699565901883, y: 23.59 }; // outside time range
const DATA_STREAM_1: DataStream = {
  id: `${ASSET_ID_1}---${PROPERTY_ID_1}`,
  data: [DATA_POINT_1, DATA_POINT_2, DATA_POINT_3],
  resolution: 2600,
  aggregationType: 'AVERAGE',
  name: 'my-name',
};
const DATA_POINT_4 = { x: 1699554901783, y: true };
const DATA_POINT_5 = { x: 1699555901883, y: false };
const DATA_POINT_6 = { x: 1699565901883, y: 23.59 }; // outside time range
const DATA_STREAM_2: DataStream = {
  id: `${ASSET_ID_1}---${PROPERTY_ID_2}`,
  data: [DATA_POINT_4, DATA_POINT_5, DATA_POINT_6],
  resolution: 2600,
  aggregationType: 'AVERAGE',
  name: 'my-name-2',
};

jest.mock('@iot-app-kit/react-components', () => {
  const original = jest.requireActual('@iot-app-kit/react-components');
  return {
    ...original,
    useTimeSeriesData: jest.fn(() => ({
      dataStreams: [DATA_STREAM_1, DATA_STREAM_2],
    })),
  };
});

it('given query with modeled data it returns a list of CSVObjects', async () => {
  (useTimeSeriesData as jest.Mock).mockImplementation(
    jest.fn(() => ({ dataStreams: [DATA_STREAM_1, DATA_STREAM_2] }))
  );
  server.use(describeTimeSeriesHandler());

  const mockQueryConfig = {
    source: 'iotsitewise',
    query: {
      ...MOCK_QUERY,
    },
  } as StyledSiteWiseQueryConfig;

  const { result } = renderHook(
    () =>
      useViewportData({
        viewport: {
          start: new Date(1699554901783),
          end: new Date(1699555901883),
        },
        queryConfig: mockQueryConfig,
        client: createMockSiteWiseSDK() as unknown as IoTSiteWiseClient,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={MOCK_QUERY_CLIENT}>
          {children}
        </QueryClientProvider>
      ),
    }
  );
  await waitFor(() => expect(useTimeSeriesData).toBeCalled());
  const { fetchViewportData } = result.current;
  const { data, isError } = await fetchViewportData(12431324123);
  expect(isError).toBe(false);
  if (data && data.length > 0) {
    expect(data.length).toBe(4);
    expect(data[0]).toHaveProperty('assetId', ASSET_ID_1);
    expect(data[0]).toHaveProperty('propertyId', PROPERTY_ID_1);
    expect(data[0]).toHaveProperty('dataQuality', 'GOOD');
    expect(data[0]).not.toHaveProperty('alias');
    expect(data[2]).toHaveProperty('propertyId', PROPERTY_ID_2);
  }
});

it('given empty query it returns an empty list ofCSVObjects', async () => {
  (useTimeSeriesData as jest.Mock).mockImplementation(
    jest.fn(() => ({ dataStreams: [] }))
  );

  const mockQueryConfig = {
    source: 'iotsitewise',
    query: { assets: [] },
  } as StyledSiteWiseQueryConfig;

  const { result } = renderHook(
    () =>
      useViewportData({
        viewport: {
          start: new Date(1699554901783),
          end: new Date(1699555901883),
        },
        queryConfig: mockQueryConfig,
        client: createMockSiteWiseSDK() as unknown as IoTSiteWiseClient,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={MOCK_QUERY_CLIENT}>
          {children}
        </QueryClientProvider>
      ),
    }
  );

  await waitFor(() => expect(useTimeSeriesData).toBeCalled());
  const { fetchViewportData } = result.current;
  const { data, isError } = await fetchViewportData(12431324123);
  expect(isError).toBe(false);
  expect(data && data.length).toBe(0);
});
