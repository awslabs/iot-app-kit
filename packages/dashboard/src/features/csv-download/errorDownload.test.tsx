import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

import React from 'react';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { CSVDownloadButton } from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFetchTimeSeriesData } from '../dashboard/queryContext';
import { StyledAssetQuery } from '~/customization/widgets/types';
import { DataStream } from '@iot-app-kit/core';

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const assetId1 = 'some-asset-id-1';
const propertyId1 = 'some-property-id-1';
const alias1 = 'some-asset-alias-1';

const MOCK_DATA_STREAM_1: DataStream = {
  data: [],
  unit: 'MPH',
  aggregationType: 'AVERAGE',
  resolution: 86000,
  name: 'Average Wind Speed',
  id: '1233545352---56842304',
  error: { msg: 'failure' },
};

const MOCK_QUERY: StyledAssetQuery = {
  assets: [{ assetId: assetId1, properties: [{ propertyId: propertyId1 }] }],
  properties: [{ propertyAlias: alias1 }],
};

const mockFetchTimeSeriesData = jest.fn(() =>
  Promise.resolve([MOCK_DATA_STREAM_1])
);
jest.mock('../dashboard/queryContext', () => ({
  useFetchTimeSeriesData: jest.fn(() => mockFetchTimeSeriesData),
}));
jest.mock('~/data/listAssetPropertiesMap/fetchListAssetPropertiesMap', () => ({
  fetchListAssetPropertiesMap: jest.fn(),
}));

it('console an errors if data has errors', async function () {
  render(
    <QueryClientProvider client={testQueryClient}>
      <CSVDownloadButton
        queryConfig={{
          source: 'iotsitewise',
          query: {
            ...MOCK_QUERY,
          },
        }}
        widgetType='line'
        fileName='csv-test'
        client={createMockSiteWiseSDK() as unknown as IoTSiteWiseClient}
      />
    </QueryClientProvider>
  );

  const consoleErrorSpy = jest.spyOn(console, 'error');

  const downloadButton = screen.queryByTestId(/csv-download-button/);
  downloadButton && fireEvent.click(downloadButton);
  expect(useFetchTimeSeriesData).toHaveBeenCalled();
  await waitFor(() => expect(consoleErrorSpy).toBeCalled());
});

it('does not create a file for download if data has errors', async function () {
  render(
    <QueryClientProvider client={testQueryClient}>
      <CSVDownloadButton
        queryConfig={{
          source: 'iotsitewise',
          query: {
            ...MOCK_QUERY,
          },
        }}
        widgetType='line'
        fileName='csv-test'
        client={createMockSiteWiseSDK() as unknown as IoTSiteWiseClient}
      />
    </QueryClientProvider>
  );

  const downloadButton = screen.queryByTestId(/csv-download-button/);

  const createElementSpyOn = jest.spyOn(document, 'createElement');
  downloadButton && fireEvent(downloadButton, new MouseEvent('click'));
  await waitFor(() => expect(useFetchTimeSeriesData).toHaveBeenCalled());
  await waitFor(() => expect(createElementSpyOn).not.toBeCalledWith('a'));
});
