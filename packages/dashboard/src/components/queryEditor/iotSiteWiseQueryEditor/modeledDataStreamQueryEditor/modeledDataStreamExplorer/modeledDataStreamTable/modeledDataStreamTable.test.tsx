import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureDashboardStore } from '~/store';
import { ModeledDataStream } from '../types';
import { ModeledDataStreamTable } from './modeledDataStreamTable';
import { SelectedAsset } from '../../types';

describe('ModeledDataStreamTable component', () => {
  test('renders error component when isError is true', () => {
    const modeledDataStreams = [
      {
        assetId: 'asset-1',
        propertyId: 'property-1',
      },
    ] as ModeledDataStream[];

    const selectedAssets = {
      assetId: 'asset-1',
      assetModelId: 'property-1',
    } as SelectedAsset;

    render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [],
          },
        })}
      >
        <QueryClientProvider client={new QueryClient()}>
          <ModeledDataStreamTable
            onClickAddModeledDataStreams={jest.fn()}
            selectedAsset={selectedAssets}
            modeledDataStreams={modeledDataStreams}
            isLoading={false}
            isError={true}
            client={createMockSiteWiseSDK() as IoTSiteWiseClient}
          />
        </QueryClientProvider>
      </Provider>
    );

    const errorMessage = screen.getByText('an error has occurred.');
    expect(errorMessage).toBeInTheDocument();
  });
});
