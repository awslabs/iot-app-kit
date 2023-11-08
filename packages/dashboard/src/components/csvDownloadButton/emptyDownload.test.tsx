import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

import React from 'react';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { CSVDownloadButton } from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StyledAssetQuery } from '~/customization/widgets/types';

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

const MOCK_EMPTY_QUERY: StyledAssetQuery = {
  assets: [],
};

const mockFetchViewportData = jest.fn(() => Promise.resolve({ isError: false, data: [] }));
jest.mock('./useViewportData', () => ({
  useViewportData: jest.fn(() => ({
    fetchViewportData: mockFetchViewportData,
  })),
}));

it('does not render button if query has no content', function () {
  render(
    <QueryClientProvider client={testQueryClient}>
      <CSVDownloadButton
        queryConfig={{
          source: 'iotsitewise',
          query: MOCK_EMPTY_QUERY,
        }}
        fileName='csv-test'
        client={createMockSiteWiseSDK() as IoTSiteWiseClient}
      />
    </QueryClientProvider>
  );

  expect(screen.queryByTestId(/csv-download-button/)).toBeNull();
});

it('does not create a file for download if data is empty', async function () {
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
        client={createMockSiteWiseSDK() as IoTSiteWiseClient}
      />
    </QueryClientProvider>
  );

  const downloadButton = screen.queryByTestId(/csv-download-button/);
  downloadButton && fireEvent.click(downloadButton);
  const createElementSpyOn = jest.spyOn(document, 'createElement');
  await waitFor(() => expect(mockFetchViewportData).toBeCalled());
  await waitFor(() => expect(createElementSpyOn).not.toBeCalledWith('a'));
});
