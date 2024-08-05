import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sampleAssetSummary } from '@iot-app-kit/source-iotsitewise';
import { AssetTableColumnDefinitionsFactory } from './assetTableColumnDefinitionsFactory';
import { AssetTable } from './assetTable';
import { configureDashboardStore } from '~/store';
import { Provider } from 'react-redux';

describe('AssetTableColumnDefinitionsFactory', () => {
  describe('create', () => {
    it('should return an array of column definitions', () => {
      const columnDefinitionFactory = new AssetTableColumnDefinitionsFactory({
        NameLink: () => null,
        onClickNameLink: () => null,
      });

      const columnDefinitions = columnDefinitionFactory.create();

      expect(Array.isArray(columnDefinitions)).toBe(true);
      expect(columnDefinitions.length).toBeGreaterThan(0);
    });

    it('should include specific column definitions', () => {
      const columnDefinitionFactory = new AssetTableColumnDefinitionsFactory({
        NameLink: () => null,
        onClickNameLink: () => null,
      });

      const columnDefinitions = columnDefinitionFactory.create();

      expect(columnDefinitions.some((def) => def.id === 'arn')).toBe(true);
      expect(columnDefinitions.some((def) => def.id === 'id')).toBe(true);
      expect(columnDefinitions.some((def) => def.id === 'name')).toBe(true);
      expect(columnDefinitions.some((def) => def.id === 'description')).toBe(
        true
      );
      expect(columnDefinitions.some((def) => def.id === 'creationDate')).toBe(
        true
      );
      expect(columnDefinitions.some((def) => def.id === 'lastUpdateDate')).toBe(
        true
      );
    });
  });
});

describe('AssetTable component', () => {
  test('renders AssetTable component correctly when an error occurs', () => {
    render(
      <Provider
        store={configureDashboardStore({
          dashboardConfiguration: {
            widgets: [],
          },
        })}
      >
        <QueryClientProvider client={new QueryClient()}>
          <AssetTable
            assets={[sampleAssetSummary]}
            parentAssetId='parentAssetId'
            onClickAsset={jest.fn()}
            onClickNextPage={jest.fn()}
            onSelectAsset={jest.fn()}
            isLoading={false}
            isError={true}
            isWithoutHeader={false}
            client={createMockSiteWiseSDK() as IoTSiteWiseClient}
            hasNextPage={true}
          />
        </QueryClientProvider>
      </Provider>
    );

    const errorMessage = screen.getByText('an error has occurred.');
    expect(errorMessage).toBeInTheDocument();
  });
});
