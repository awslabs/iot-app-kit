import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

import React from 'react';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { CSVDownloadButton } from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useViewportData } from './useViewportData';
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

const mockFetchViewportData = jest.fn(() =>
  Promise.resolve({ isError: true, data: [] })
);
jest.mock('./useViewportData', () => ({
  useViewportData: jest.fn(() => ({
    fetchViewportData: mockFetchViewportData,
  })),
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
        fileName='csv-test'
        client={createMockSiteWiseSDK() as unknown as IoTSiteWiseClient}
      />
    </QueryClientProvider>
  );

  const consoleErrorSpy = jest.spyOn(console, 'error');

  const downloadButton = screen.queryByTestId(/csv-download-button/);
  downloadButton && fireEvent.click(downloadButton);
  expect(useViewportData).toHaveBeenCalled();
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
        fileName='csv-test'
        client={createMockSiteWiseSDK() as unknown as IoTSiteWiseClient}
      />
    </QueryClientProvider>
  );

  const downloadButton = screen.queryByTestId(/csv-download-button/);

  const createElementSpyOn = jest.spyOn(document, 'createElement');
  downloadButton && fireEvent(downloadButton, new MouseEvent('click'));
  await waitFor(() => expect(useViewportData).toHaveBeenCalled());
  await waitFor(() => expect(createElementSpyOn).not.toBeCalledWith('a'));
});
