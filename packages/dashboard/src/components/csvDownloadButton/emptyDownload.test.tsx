import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { CSVDownloadButton } from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  type StyledAssetQuery,
  type StyledSiteWiseQueryConfig,
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

const MOCK_EMPTY_QUERY: StyledAssetQuery = {
  assets: [],
};

const mockFetchTimeSeriesData = jest.fn(() => Promise.resolve([]));
jest.mock('../dashboard/queryContext', () => ({
  useFetchTimeSeriesData: jest.fn(() => mockFetchTimeSeriesData),
}));
jest.mock('~/data/listAssetPropertiesMap/fetchListAssetPropertiesMap', () => ({
  fetchListAssetPropertiesMap: jest.fn(),
}));

it('does not render button if query has no content', function () {
  render(
    <QueryClientProvider client={testQueryClient}>
      <CSVDownloadButton
        queryConfig={{
          source: 'iotsitewise',
          query: MOCK_EMPTY_QUERY,
        }}
        widgetType='line'
        fileName='csv-test'
        client={createMockSiteWiseSDK() as unknown as IoTSiteWiseClient}
      />
    </QueryClientProvider>
  );

  expect(screen.queryByTestId(/csv-download-button/)).toBeNull();
});

it('creates a file for download if data is empty', async function () {
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
        widgetType='line'
        client={mockClient}
      />
    </QueryClientProvider>
  );

  const downloadButton = screen.queryByTestId(/csv-download-button/);
  downloadButton && fireEvent.click(downloadButton);
  const createElementSpyOn = jest.spyOn(document, 'createElement');
  await waitFor(() => expect(mockFetchTimeSeriesData).toHaveBeenCalled());
  await waitFor(() => expect(createElementSpyOn).toBeCalledWith('a'));
});
