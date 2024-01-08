import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

import React from 'react';
import { Quality, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { CSVDownloadButton } from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useViewportData } from './useViewportData';
import {
  StyledAssetQuery,
  StyledSiteWiseQueryConfig,
} from '~/customization/widgets/types';

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

const MOCK_QUERY: StyledAssetQuery = {
  assets: [{ assetId: assetId1, properties: [{ propertyId: propertyId1 }] }],
  properties: [{ propertyAlias: alias1 }],
};

const MOCK_CSV_OBJECT_1 = {
  timestamp: 'Nov 1 1234',
  dataQuality: Quality.GOOD,
  value: 123.89,
  unit: 'MPH',
  aggregationType: 'AVERAGE',
  resolution: 86000,
  propertyName: 'Average Wind Speed',
  assetName: 'Turbine 1',
  assetId: '1233545352',
  propertyId: '56842304',
  dataType: 'DOUBLE',
};

const mockFetchViewportData = jest.fn(() =>
  Promise.resolve({
    isError: false,
    data: [MOCK_CSV_OBJECT_1, MOCK_CSV_OBJECT_1],
  })
);
jest.mock('./useViewportData', () => ({
  useViewportData: jest.fn(() => ({
    fetchViewportData: mockFetchViewportData,
  })),
}));
it('renders a working download button if query has content', function () {
  render(
    <QueryClientProvider client={testQueryClient}>
      <CSVDownloadButton
        queryConfig={{
          source: 'iotsitewise',
          query: {
            ...MOCK_QUERY,
          },
        }}
        fileName='csv-test'
        client={createMockSiteWiseSDK() as unknown as IoTSiteWiseClient}
      />
    </QueryClientProvider>
  );

  const downloadButton = screen.queryByTestId(/csv-download-button/);

  expect(downloadButton).not.toBeNull();
});

it('creates a file for download if query has content', async function () {
  global.URL.createObjectURL = jest.fn();
  const mockClient = createMockSiteWiseSDK() as unknown as IoTSiteWiseClient;
  const mockQueryConfig = {
    source: 'iotsitewise',
    query: {
      ...MOCK_QUERY,
    },
  } as StyledSiteWiseQueryConfig;
  render(
    <QueryClientProvider client={testQueryClient}>
      <CSVDownloadButton
        queryConfig={mockQueryConfig}
        fileName='csv-test'
        client={mockClient}
      />
    </QueryClientProvider>
  );

  const downloadButton = screen.queryByTestId(/csv-download-button/);
  downloadButton && fireEvent.click(downloadButton);
  const createElementSpyOn = jest.spyOn(document, 'createElement');
  expect(useViewportData).toHaveBeenCalledWith({
    queryConfig: mockQueryConfig,
    client: mockClient,
  });
  await waitFor(() => expect(mockFetchViewportData).toHaveBeenCalled());
  await waitFor(() => expect(createElementSpyOn).toBeCalledWith('a'));
});
