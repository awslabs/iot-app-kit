import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { CSVDownloadButton } from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  type StyledAssetQuery,
  type StyledSiteWiseQueryConfig,
} from '~/customization/widgets/types';
import { type DataStream, type DataType } from '@iot-app-kit/core';

const testQueryClient = new QueryClient({});

const assetId1 = 'some-asset-id-1';
const propertyId1 = 'some-property-id-1';
const alias1 = 'some-asset-alias-1';

const MOCK_QUERY: StyledAssetQuery = {
  assets: [{ assetId: assetId1, properties: [{ propertyId: propertyId1 }] }],
  properties: [{ propertyAlias: alias1 }],
};

const MOCK_DATA_STREAM_1: DataStream = {
  data: [{ x: 999324000000, y: 123.89 }],
  unit: 'MPH',
  aggregationType: 'AVERAGE',
  resolution: 86000,
  name: 'Average Wind Speed',
  dataType: 'DOUBLE' as DataType,
  id: `${assetId1}---${propertyId1}`,
};

const mockFetchTimeSeriesData = vi.fn(() =>
  Promise.resolve([MOCK_DATA_STREAM_1, MOCK_DATA_STREAM_1])
);
vi.mock('../dashboard/queryContext', () => ({
  useFetchTimeSeriesData: vi.fn(() => mockFetchTimeSeriesData),
}));

vi.mock('~/data/listAssetPropertiesMap/fetchListAssetPropertiesMap', () => ({
  fetchListAssetPropertiesMap: vi.fn(),
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
        widgetType='line'
        fileName='csv-test'
        client={createMockSiteWiseSDK() as unknown as IoTSiteWiseClient}
      />
    </QueryClientProvider>
  );

  const downloadButton = screen.queryByTestId(/csv-download-button/);

  expect(downloadButton).not.toBeNull();
});

it('creates a file for download if query has content', async function () {
  global.URL.createObjectURL = vi.fn();
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
        widgetType='line'
      />
    </QueryClientProvider>
  );

  const downloadButton = screen.queryByTestId(/csv-download-button/);
  downloadButton && fireEvent.click(downloadButton);

  const createElementSpyOn = vi.spyOn(document, 'createElement');
  await waitFor(() => expect(mockFetchTimeSeriesData).toHaveBeenCalled());
  await waitFor(() => expect(createElementSpyOn).toBeCalledWith('a'));
});
