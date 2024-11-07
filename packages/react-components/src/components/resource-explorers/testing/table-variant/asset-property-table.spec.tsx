import {
  type BatchGetAssetPropertyValue,
  type ExecuteQuery,
  type ListAssetModelProperties,
  type ListAssetProperties,
} from '@iot-app-kit/core';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { formatDate } from '../../../../utils/time';
import { DEFAULT_LATEST_VALUE_REQUEST_INTERVAL } from '../../constants/defaults';
import { AssetPropertyExplorer } from '../../explorers';
import { resourceExplorerQueryClient } from '../../requests';
import { type SelectionMode } from '../../types/common';
import { type AssetPropertyResource } from '../../types/resources';
import {
  createListAssetModelPropertiesPage,
  createListAssetPropertiesPage,
} from '../helpers/responses';
import * as table from '../helpers/table';

function SelectableAssetPropertyTable({
  selectionMode,
  listAssetProperties,
  listAssetModelProperties,
}: {
  selectionMode?: SelectionMode;
  listAssetProperties: ListAssetProperties;
  listAssetModelProperties: ListAssetModelProperties;
}) {
  const [selectedAssetProperties, setSelectedAssetProperties] = useState<
    AssetPropertyResource[]
  >([]);

  return (
    <AssetPropertyExplorer
      iotSiteWiseClient={{ listAssetProperties, listAssetModelProperties }}
      parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
      selectionMode={selectionMode}
      selectedAssetProperties={selectedAssetProperties}
      onSelectAssetProperty={setSelectedAssetProperties}
    />
  );
}

describe('asset property table', () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
  });

  describe('rendering', () => {
    it('renders a table without configuration', async () => {
      render(<AssetPropertyExplorer />);

      expect(screen.getByRole('table')).toBeVisible();
      expect(screen.getByText(`No asset properties.`));

      // Title
      expect(screen.getByText('Asset properties'));
      expect(screen.getByText('(0)')).toBeVisible();

      // Search
      expect(table.querySearchField()).not.toBeInTheDocument();

      // Filter
      expect(screen.queryByLabelText('Filter')).not.toBeInTheDocument();

      // User settings
      expect(
        screen.queryByRole('button', { name: 'Preferences' })
      ).not.toBeInTheDocument();

      // Pagination
      expect(table.getPreviousPageButton()).toBeVisible();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).toBeVisible();
      expect(table.getNextPageButton()).toBeDisabled();
    });

    it('renders without title disabled', () => {
      render(
        <AssetPropertyExplorer tableSettings={{ isTitleEnabled: false }} />
      );

      expect(screen.queryByText('Asset properties')).not.toBeInTheDocument();
      expect(screen.queryByText('(0)')).not.toBeInTheDocument();
    });

    it('renders with search enabled', () => {
      render(
        <AssetPropertyExplorer tableSettings={{ isSearchEnabled: true }} />
      );

      expect(table.getSearchField()).toBeVisible();
    });

    it('renders with filter enabled', () => {
      render(
        <AssetPropertyExplorer tableSettings={{ isFilterEnabled: true }} />
      );

      expect(screen.getByLabelText('Filter')).toBeVisible();
    });

    it('renders with user settings enabled', () => {
      render(
        <AssetPropertyExplorer
          tableSettings={{ isUserSettingsEnabled: true }}
        />
      );

      expect(screen.getByRole('button', { name: 'Preferences' })).toBeVisible();
    });

    it('renders a list of asset properties', async () => {
      const listAssetPropertiesResponse = createListAssetPropertiesPage(3);
      const listAssetModelPropertiesResponse =
        createListAssetModelPropertiesPage(3);
      const assetProperty1 = {
        ...listAssetPropertiesResponse.assetPropertySummaries[0],
        unit: 'm/s',
      };
      const assetModelProperty1 = {
        ...listAssetModelPropertiesResponse.assetModelPropertySummaries[0],
        dataType: 'STRING',
      };
      const assetProperty2 = {
        ...listAssetPropertiesResponse.assetPropertySummaries[1],
        unit: 'km/s',
      };
      const assetModelProperty2 = {
        ...listAssetModelPropertiesResponse.assetModelPropertySummaries[1],
        dataType: 'DOUBLE',
      };
      const assetProperty3 = {
        ...listAssetPropertiesResponse.assetPropertySummaries[2],
        unit: 'cm/s',
      };
      const assetModelProperty3 = {
        ...listAssetModelPropertiesResponse.assetModelPropertySummaries[2],
        dataType: 'INTEGER',
      };
      const listAssetProperties = jest.fn().mockResolvedValue({
        assetPropertySummaries: [
          assetProperty1,
          assetProperty2,
          assetProperty3,
        ],
      });
      const listAssetModelProperties = jest.fn().mockResolvedValue({
        assetModelPropertySummaries: [
          assetModelProperty1,
          assetModelProperty2,
          assetModelProperty3,
        ],
      });
      render(
        <AssetPropertyExplorer
          iotSiteWiseClient={{ listAssetProperties, listAssetModelProperties }}
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(screen.getByText(assetModelProperty1.name)).toBeVisible();
      expect(screen.getByText(assetModelProperty1.dataType)).toBeVisible();
      expect(screen.getByText(assetProperty1.unit)).toBeVisible();
      expect(screen.getByText(assetModelProperty2.name)).toBeVisible();
      expect(screen.getByText(assetModelProperty2.dataType)).toBeVisible();
      expect(screen.getByText(assetProperty1.unit)).toBeVisible();
      expect(screen.getByText(assetModelProperty3.name)).toBeVisible();
      expect(screen.getByText(assetModelProperty3.dataType)).toBeVisible();
      expect(screen.getByText(assetProperty1.unit)).toBeVisible();
    });

    it('renders expected columns', () => {
      render(<AssetPropertyExplorer />);

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Unit')).toBeVisible();
      expect(screen.getByText('Data type')).toBeVisible();
      expect(screen.queryByText('Data type spec')).not.toBeInTheDocument();
      expect(screen.queryByText('ID')).not.toBeInTheDocument();
      expect(screen.queryByText('Alias')).not.toBeInTheDocument();
      expect(screen.queryByText('Latest value')).not.toBeInTheDocument();
      expect(screen.queryByText('Latest value time')).not.toBeInTheDocument();
    });

    it('renders expected columns when displaying latest values', () => {
      render(
        <AssetPropertyExplorer
          iotSiteWiseClient={{ batchGetAssetPropertyValue: jest.fn() }}
        />
      );

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Unit')).toBeVisible();
      expect(screen.getByText('Data type')).toBeVisible();
      expect(screen.getByText('Latest value')).toBeVisible();
      expect(screen.getByText('Latest value time')).toBeVisible();
      expect(screen.queryByText('Data type spec')).not.toBeInTheDocument();
      expect(screen.queryByText('ID')).not.toBeInTheDocument();
      expect(screen.queryByText('Alias')).not.toBeInTheDocument();
    });
  });

  describe('requests', () => {
    it('requests a single page of asset properties correctly', async () => {
      const listAssetProperties = jest
        .fn()
        .mockResolvedValue(createListAssetPropertiesPage(3));
      const listAssetModelProperties = jest
        .fn()
        .mockResolvedValue(createListAssetModelPropertiesPage(3));
      render(
        <AssetPropertyExplorer
          iotSiteWiseClient={{ listAssetProperties, listAssetModelProperties }}
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(listAssetProperties).toHaveBeenCalledOnce();
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeVisible();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).toBeVisible();
      expect(table.getNextPageButton()).toBeDisabled();
    });

    it('requests multiple pages of asset properties correctly', async () => {
      const listAssetProperties = jest
        .fn()
        .mockResolvedValueOnce(
          createListAssetPropertiesPage(10, 0, 'next-token')
        )
        .mockResolvedValueOnce(createListAssetPropertiesPage(10, 10));
      const listAssetModelProperties = jest
        .fn()
        .mockResolvedValue(createListAssetModelPropertiesPage(20));
      render(
        <AssetPropertyExplorer
          defaultPageSize={10}
          iotSiteWiseClient={{ listAssetProperties, listAssetModelProperties }}
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(listAssetProperties).toHaveBeenCalledOnce();
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
      expect(screen.getByText('(10)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButtonWithLoading();

      expect(listAssetProperties).toHaveBeenCalledTimes(2);
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).toBeDisabled();

      await table.clickPreviousPageButton();

      expect(listAssetProperties).toHaveBeenCalledTimes(2);
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButton();

      expect(listAssetProperties).toHaveBeenCalledTimes(2);
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).toBeDisabled();
    });

    it('requests multiple lists of pages of asset properties correctly', async () => {
      const listAssetProperties = jest
        .fn()
        .mockResolvedValueOnce(
          createListAssetPropertiesPage(10, 0, 'next-token-1')
        )
        .mockResolvedValueOnce(createListAssetPropertiesPage(5, 10))
        .mockResolvedValueOnce(
          createListAssetPropertiesPage(5, 15, 'next-token-2')
        )
        .mockResolvedValueOnce(createListAssetPropertiesPage(10, 20));
      const listAssetModelProperties = jest
        .fn()
        .mockResolvedValue(createListAssetModelPropertiesPage(30, 0));
      render(
        <AssetPropertyExplorer
          defaultPageSize={10}
          iotSiteWiseClient={{ listAssetProperties, listAssetModelProperties }}
          parameters={[
            { assetId: 'asset-id-1', assetModelId: 'asset-model-id-1' },
            { assetId: 'asset-id-2', assetModelId: 'asset-model-id-1' },
          ]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(listAssetProperties).toHaveBeenCalledOnce();
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
      expect(screen.getByText('(10)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButtonWithLoading();

      expect(listAssetProperties).toHaveBeenCalledTimes(3);
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButtonWithLoading();

      expect(listAssetProperties).toHaveBeenCalledTimes(4);
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).toBeDisabled();

      await table.clickPreviousPageButton();

      expect(listAssetProperties).toHaveBeenCalledTimes(4);
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickPreviousPageButton();

      expect(listAssetProperties).toHaveBeenCalledTimes(4);
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButton();

      expect(listAssetProperties).toHaveBeenCalledTimes(4);
      expect(listAssetModelProperties).toHaveBeenCalledOnce();
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();
    });
  });

  describe('search', () => {
    it('searches for asset properties as expected', async () => {
      const executeQuery = jest
        .fn()
        .mockResolvedValue({ rows: [] } satisfies Awaited<
          ReturnType<ExecuteQuery>
        >);
      render(
        <AssetPropertyExplorer
          iotSiteWiseClient={{ executeQuery }}
          tableSettings={{ isSearchEnabled: true }}
        />
      );
      await table.typeSearchStatement('Asset Property');
      await table.clickSearch();

      const queryStatement = executeQuery.mock.calls[0][0].queryStatement;

      // White space is removed to match
      expect(queryStatement.replace(/\s/g, '')).toEqual(
        `
          SELECT p.property_id, p.property_name, p.asset_id, p.property_alias, p.property_data_type
          FROM asset_property p
          WHERE p.property_name LIKE '%Asset Property%'
        `.replace(/\s/g, '')
      );
    });

    it('supports searching for asset properties by user', async () => {
      const assetPropertyRow1 = {
        data: [
          { scalarValue: 'asset-property-id-1' },
          { scalarValue: 'Asset Property 1' },
          { scalarValue: 'asset-id-1' },
          { scalarValue: 'alias-1' },
          { scalarValue: 'STRING' },
        ],
      };
      const assetPropertyRow2 = {
        data: [
          { scalarValue: 'asset-property-id-2' },
          { scalarValue: 'Asset Property 2' },
          { scalarValue: 'asset-id-2' },
          { scalarValue: 'alias-2' },
          { scalarValue: 'INTEGER' },
        ],
      };
      const assetPropertyRow3 = {
        data: [
          { scalarValue: 'asset-property-id-3' },
          { scalarValue: 'Asset Property 3' },
          { scalarValue: 'asset-id-3' },
          { scalarValue: 'alias-3' },
          { scalarValue: 'DOUBLE' },
        ],
      };

      const executeQuery = jest.fn().mockResolvedValue({
        rows: [assetPropertyRow1, assetPropertyRow2, assetPropertyRow3],
      } satisfies Awaited<ReturnType<ExecuteQuery>>);
      render(
        <AssetPropertyExplorer
          iotSiteWiseClient={{ executeQuery }}
          tableSettings={{ isSearchEnabled: true }}
        />
      );

      await table.typeSearchStatement('Asset Property');
      await table.clickSearch();

      // Name is rendered
      expect(
        screen.getByText(assetPropertyRow1.data[1].scalarValue)
      ).toBeVisible();
      expect(
        screen.getByText(assetPropertyRow2.data[1].scalarValue)
      ).toBeVisible();
      expect(
        screen.getByText(assetPropertyRow3.data[1].scalarValue)
      ).toBeVisible();
      // Property ID is not rendered by default
      expect(
        screen.queryByText(assetPropertyRow1.data[0].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow2.data[0].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow3.data[0].scalarValue)
      ).not.toBeInTheDocument();
      // Asset ID is not rendered by default
      expect(
        screen.queryByText(assetPropertyRow1.data[2].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow2.data[2].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow3.data[2].scalarValue)
      ).not.toBeInTheDocument();
      // Alias is not rendered by default
      expect(
        screen.queryByText(assetPropertyRow1.data[3].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow2.data[3].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow3.data[3].scalarValue)
      ).not.toBeInTheDocument();
      // DataType is rendered by default
      expect(
        screen.queryByText(assetPropertyRow1.data[4].scalarValue)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow2.data[4].scalarValue)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow3.data[4].scalarValue)
      ).toBeInTheDocument();
    });

    it('supports searching for asset properties with parameters', async () => {
      const assetPropertyRow1 = {
        data: [
          { scalarValue: 'asset-property-id-1' },
          { scalarValue: 'Asset Property 1' },
          { scalarValue: 'asset-id-1' },
          { scalarValue: 'alias-1' },
          { scalarValue: 'STRING' },
        ],
      };
      const assetPropertyRow2 = {
        data: [
          { scalarValue: 'asset-property-id-2' },
          { scalarValue: 'Asset Property 2' },
          { scalarValue: 'asset-id-2' },
          { scalarValue: 'alias-2' },
          { scalarValue: 'INTEGER' },
        ],
      };
      const assetPropertyRow3 = {
        data: [
          { scalarValue: 'asset-property-id-3' },
          { scalarValue: 'Asset Property 3' },
          { scalarValue: 'asset-id-3' },
          { scalarValue: 'alias-3' },
          { scalarValue: 'DOUBLE' },
        ],
      };

      const executeQuery = jest.fn().mockResolvedValue({
        rows: [assetPropertyRow1, assetPropertyRow2, assetPropertyRow3],
      } satisfies Awaited<ReturnType<ExecuteQuery>>);
      render(
        <AssetPropertyExplorer
          iotSiteWiseClient={{ executeQuery }}
          parameters={[{ searchStatement: 'Asset Property' }]}
          tableSettings={{ isSearchEnabled: true }}
        />
      );

      await table.waitForLoadingToFinish();

      // Name is rendered
      expect(
        screen.getByText(assetPropertyRow1.data[1].scalarValue)
      ).toBeVisible();
      expect(
        screen.getByText(assetPropertyRow2.data[1].scalarValue)
      ).toBeVisible();
      expect(
        screen.getByText(assetPropertyRow3.data[1].scalarValue)
      ).toBeVisible();
      // Property ID is not rendered by default
      expect(
        screen.queryByText(assetPropertyRow1.data[0].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow2.data[0].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow3.data[0].scalarValue)
      ).not.toBeInTheDocument();
      // Asset ID is not rendered by default
      expect(
        screen.queryByText(assetPropertyRow1.data[2].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow2.data[2].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow3.data[2].scalarValue)
      ).not.toBeInTheDocument();
      // Alias is not rendered by default
      expect(
        screen.queryByText(assetPropertyRow1.data[3].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow2.data[3].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow3.data[3].scalarValue)
      ).not.toBeInTheDocument();
      // DataType is rendered by default
      expect(
        screen.queryByText(assetPropertyRow1.data[4].scalarValue)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow2.data[4].scalarValue)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(assetPropertyRow3.data[4].scalarValue)
      ).toBeInTheDocument();
    });

    it('initiates search when user presses enter/return key', async () => {
      const executeQuery = jest
        .fn()
        .mockResolvedValue({ rows: [] } satisfies Awaited<
          ReturnType<ExecuteQuery>
        >);
      render(
        <AssetPropertyExplorer
          iotSiteWiseClient={{ executeQuery }}
          tableSettings={{ isSearchEnabled: true }}
        />
      );
      await table.typeSearchStatement('Asset Property');
      await table.pressReturnKeyToSearch();

      expect(executeQuery).toHaveBeenCalledOnce();
    });
  });

  describe('latest values', () => {
    it('supports displaying the latest values of asset properties', async () => {
      const listAssetPropertiesResponse = createListAssetPropertiesPage(3);
      const listAssetModelPropertiesResponse =
        createListAssetModelPropertiesPage(3);
      const {
        assetModelPropertySummaries: [
          assetModelProperty1,
          assetModelProperty2,
          assetModelProperty3,
        ],
      } = listAssetModelPropertiesResponse;
      const listAssetProperties = jest
        .fn()
        .mockResolvedValue(listAssetPropertiesResponse);
      const listAssetModelProperties = jest
        .fn()
        .mockResolvedValue(listAssetModelPropertiesResponse);
      const assetProperty1SuccessEntry = {
        // Entry ID constructure is an implementation detail
        entryId: 'assetidassetproperty0',
        assetPropertyValue: {
          timestamp: {
            timeInSeconds: 100,
          },
          value: {
            stringValue: 'String Value',
          },
        },
      };
      const assetProperty2SuccessEntry = {
        entryId: 'assetidassetproperty1',
        assetPropertyValue: {
          timestamp: {
            timeInSeconds: 200,
          },
          value: {
            integerValue: 40,
          },
        },
      };
      const assetProperty3SuccessEntry = {
        entryId: 'assetidassetproperty2',
        assetPropertyValue: {
          timestamp: {
            timeInSeconds: 300,
          },
          value: {
            doubleValue: 35.5,
          },
        },
      };
      const batchGetAssetPropertyValue = jest.fn().mockResolvedValue({
        successEntries: [
          assetProperty1SuccessEntry,
          assetProperty2SuccessEntry,
          assetProperty3SuccessEntry,
        ],
        skippedEntries: [],
        errorEntries: [],
      } satisfies Awaited<ReturnType<BatchGetAssetPropertyValue>>);
      render(
        <AssetPropertyExplorer
          iotSiteWiseClient={{
            batchGetAssetPropertyValue,
            listAssetProperties,
            listAssetModelProperties,
          }}
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(batchGetAssetPropertyValue).toHaveBeenCalledOnce();
      expect(screen.getByText(assetModelProperty1.name)).toBeVisible();
      expect(screen.getByText(assetModelProperty2.name)).toBeVisible();
      expect(screen.getByText(assetModelProperty3.name)).toBeVisible();
      expect(
        screen.getByText(
          assetProperty1SuccessEntry.assetPropertyValue.value.stringValue
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          assetProperty2SuccessEntry.assetPropertyValue.value.integerValue
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          assetProperty3SuccessEntry.assetPropertyValue.value.doubleValue
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          formatDate(
            assetProperty1SuccessEntry.assetPropertyValue.timestamp
              .timeInSeconds * 1000
          )
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          formatDate(
            assetProperty2SuccessEntry.assetPropertyValue.timestamp
              .timeInSeconds * 1000
          )
        )
      ).toBeVisible();
      expect(
        screen.getByText(
          formatDate(
            assetProperty3SuccessEntry.assetPropertyValue.timestamp
              .timeInSeconds * 1000
          )
        )
      ).toBeVisible();
    });

    it('regularly requests latest values', async () => {
      jest.useFakeTimers();
      const listAssetProperties = jest
        .fn()
        .mockResolvedValue(createListAssetPropertiesPage(3));
      const listAssetModelProperties = jest
        .fn()
        .mockResolvedValue(createListAssetModelPropertiesPage(3));
      const batchGetAssetPropertyValue = jest.fn().mockResolvedValue({
        successEntries: [],
        skippedEntries: [],
        errorEntries: [],
      } satisfies Awaited<ReturnType<BatchGetAssetPropertyValue>>);
      render(
        <AssetPropertyExplorer
          iotSiteWiseClient={{
            batchGetAssetPropertyValue,
            listAssetProperties,
            listAssetModelProperties,
          }}
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(batchGetAssetPropertyValue).toHaveBeenCalledOnce();

      jest.advanceTimersByTime(DEFAULT_LATEST_VALUE_REQUEST_INTERVAL);
      expect(batchGetAssetPropertyValue).toHaveBeenCalledTimes(2);

      // Remove mocking
      jest.useRealTimers();
    });
  });

  describe('selection', () => {
    it('does not allow selecting asset properties if selectionMode is undefined', async () => {
      const listAssetProperties = jest
        .fn()
        .mockResolvedValue(createListAssetPropertiesPage(3));
      const listAssetModelProperties = jest
        .fn()
        .mockResolvedValue(createListAssetModelPropertiesPage(3));

      render(
        <SelectableAssetPropertyTable
          listAssetProperties={listAssetProperties}
          listAssetModelProperties={listAssetModelProperties}
        />
      );

      await table.waitForLoadingToFinish();

      expect(screen.queryAllByRole('radio')).toHaveLength(0);
      expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });

    describe('single-select', () => {
      it('allows selecting a single asset property', async () => {
        const listAssetProperties = jest
          .fn()
          .mockResolvedValue(createListAssetPropertiesPage(3));
        const listAssetModelProperties = jest
          .fn()
          .mockResolvedValue(createListAssetModelPropertiesPage(3));
        const user = userEvent.setup();
        render(
          <SelectableAssetPropertyTable
            selectionMode='single'
            listAssetProperties={listAssetProperties}
            listAssetModelProperties={listAssetModelProperties}
          />
        );

        await table.waitForLoadingToFinish();

        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
        const radios = screen.queryAllByRole('radio');
        expect(radios).toHaveLength(3);
        const [assetPropertyRadio1, assetPropertyRadio2, assetPropertyRadio3] =
          radios;

        expect(assetPropertyRadio1).not.toBeChecked();
        expect(assetPropertyRadio2).not.toBeChecked();
        expect(assetPropertyRadio3).not.toBeChecked();

        await user.click(assetPropertyRadio1);

        expect(assetPropertyRadio1).toBeChecked();
        expect(assetPropertyRadio2).not.toBeChecked();
        expect(assetPropertyRadio3).not.toBeChecked();

        await user.click(assetPropertyRadio2);

        expect(assetPropertyRadio1).not.toBeChecked();
        expect(assetPropertyRadio2).toBeChecked();
        expect(assetPropertyRadio3).not.toBeChecked();

        await user.click(assetPropertyRadio3);

        expect(assetPropertyRadio1).not.toBeChecked();
        expect(assetPropertyRadio2).not.toBeChecked();
        expect(assetPropertyRadio3).toBeChecked();
      });
    });

    describe('multi-select', () => {
      it('allows selecting multiple asset properties', async () => {
        const listAssetProperties = jest
          .fn()
          .mockResolvedValue(createListAssetPropertiesPage(3));
        const listAssetModelProperties = jest
          .fn()
          .mockResolvedValue(createListAssetPropertiesPage(3));
        const user = userEvent.setup();
        render(
          <SelectableAssetPropertyTable
            selectionMode='multi'
            listAssetProperties={listAssetProperties}
            listAssetModelProperties={listAssetModelProperties}
          />
        );

        await table.waitForLoadingToFinish();

        expect(screen.queryAllByRole('radio')).toHaveLength(0);
        const checkboxes = screen.queryAllByRole('checkbox');
        expect(checkboxes).toHaveLength(4);
        const [
          allAssetPropertiesCheckbox,
          assetPropertyCheckbox1,
          assetPropertyCheckbox2,
          assetPropertyCheckbox3,
        ] = checkboxes;

        expect(allAssetPropertiesCheckbox).not.toBeChecked();
        expect(allAssetPropertiesCheckbox).not.toBePartiallyChecked();
        expect(assetPropertyCheckbox1).not.toBeChecked();
        expect(assetPropertyCheckbox2).not.toBeChecked();
        expect(assetPropertyCheckbox3).not.toBeChecked();

        await user.click(assetPropertyCheckbox1);

        expect(allAssetPropertiesCheckbox).not.toBeChecked();
        expect(allAssetPropertiesCheckbox).toBePartiallyChecked();
        expect(assetPropertyCheckbox1).toBeChecked();
        expect(assetPropertyCheckbox2).not.toBeChecked();
        expect(assetPropertyCheckbox3).not.toBeChecked();

        await user.click(assetPropertyCheckbox2);

        expect(allAssetPropertiesCheckbox).not.toBeChecked();
        expect(allAssetPropertiesCheckbox).toBePartiallyChecked();
        expect(assetPropertyCheckbox1).toBeChecked();
        expect(assetPropertyCheckbox2).toBeChecked();
        expect(assetPropertyCheckbox3).not.toBeChecked();

        await user.click(assetPropertyCheckbox3);

        expect(allAssetPropertiesCheckbox).toBeChecked();
        expect(allAssetPropertiesCheckbox).not.toBePartiallyChecked();
        expect(assetPropertyCheckbox1).toBeChecked();
        expect(assetPropertyCheckbox2).toBeChecked();
        expect(assetPropertyCheckbox3).toBeChecked();

        await user.click(assetPropertyCheckbox1);

        expect(allAssetPropertiesCheckbox).not.toBeChecked();
        expect(allAssetPropertiesCheckbox).toBePartiallyChecked();
        expect(assetPropertyCheckbox1).not.toBeChecked();
        expect(assetPropertyCheckbox2).toBeChecked();
        expect(assetPropertyCheckbox3).toBeChecked();

        await user.click(assetPropertyCheckbox2);

        expect(allAssetPropertiesCheckbox).not.toBeChecked();
        expect(allAssetPropertiesCheckbox).toBePartiallyChecked();
        expect(assetPropertyCheckbox1).not.toBeChecked();
        expect(assetPropertyCheckbox2).not.toBeChecked();
        expect(assetPropertyCheckbox3).toBeChecked();

        await user.click(assetPropertyCheckbox3);

        expect(allAssetPropertiesCheckbox).not.toBeChecked();
        expect(allAssetPropertiesCheckbox).not.toBePartiallyChecked();
        expect(assetPropertyCheckbox1).not.toBeChecked();
        expect(assetPropertyCheckbox2).not.toBeChecked();
        expect(assetPropertyCheckbox3).not.toBeChecked();
      });
    });
  });

  describe('filtering', () => {
    it('supports filtering by property', async () => {
      const listAssetProperties = jest
        .fn()
        .mockResolvedValue(createListAssetPropertiesPage(3));
      const listAssetModelProperties = jest
        .fn()
        .mockResolvedValue(createListAssetModelPropertiesPage(3));
      render(
        <AssetPropertyExplorer
          tableSettings={{ isFilterEnabled: true }}
          iotSiteWiseClient={{ listAssetProperties, listAssetModelProperties }}
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
        />
      );

      await table.waitForLoadingToFinish();
      await table.openFilterControls();

      expect(screen.getByRole('option', { name: 'Name' })).toBeVisible();
      expect(screen.getByRole('option', { name: 'Unit' })).toBeVisible();
      expect(screen.getByRole('option', { name: 'Data type' })).toBeVisible();
      expect(
        screen.getByRole('option', { name: 'Data type spec' })
      ).toBeVisible();
      expect(screen.getByRole('option', { name: 'ID' })).toBeVisible();
      expect(screen.getByRole('option', { name: 'Alias' })).toBeVisible();
    });

    it('supports filtering by text', async () => {
      const listAssetModelPropertiesResponse =
        createListAssetModelPropertiesPage(3);
      const assetModelProperty1 = {
        ...listAssetModelPropertiesResponse.assetModelPropertySummaries[0],
        name: 'Similar Name 1',
      };
      const assetModelProperty2 = {
        ...listAssetModelPropertiesResponse.assetModelPropertySummaries[1],
        name: 'Similar Name 2',
      };
      const assetModelProperty3 = {
        ...listAssetModelPropertiesResponse.assetModelPropertySummaries[2],
        name: 'Different Name 3',
      };
      const listAssetProperties = jest
        .fn()
        .mockResolvedValue(createListAssetPropertiesPage(3));
      const listAssetModelProperties = jest.fn().mockResolvedValue({
        assetModelPropertySummaries: [
          assetModelProperty1,
          assetModelProperty2,
          assetModelProperty3,
        ],
      });
      const user = userEvent.setup();
      render(
        <AssetPropertyExplorer
          tableSettings={{ isFilterEnabled: true }}
          iotSiteWiseClient={{ listAssetProperties, listAssetModelProperties }}
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(screen.getByText(assetModelProperty1.name)).toBeVisible();
      expect(screen.getByText(assetModelProperty2.name)).toBeVisible();
      expect(screen.getByText(assetModelProperty3.name)).toBeVisible();

      await table.openFilterControls();
      await user.keyboard('Similar');
      await user.click(screen.getByText('Use: "Similar"'));

      expect(screen.getByText(assetModelProperty1.name)).toBeVisible();
      expect(screen.getByText(assetModelProperty2.name)).toBeVisible();
      expect(
        screen.queryByText(assetModelProperty3.name)
      ).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Clear filters' }));

      expect(screen.getByText(assetModelProperty1.name)).toBeVisible();
      expect(screen.getByText(assetModelProperty2.name)).toBeVisible();
      expect(screen.getByText(assetModelProperty3.name)).toBeVisible();
    });
  });

  describe('user settings', () => {
    it('renders user settings as expected', async () => {
      const user = userEvent.setup();
      render(
        <AssetPropertyExplorer
          tableSettings={{ isUserSettingsEnabled: true }}
        />
      );

      expect(screen.queryByText('Preferences')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Preferences' }));

      expect(screen.getByText('Preferences')).toBeVisible();
      expect(screen.getByText('Page size')).toBeVisible();
      expect(screen.getByText('Wrap lines')).toBeVisible();
      expect(screen.getByText('Striped rows')).toBeVisible();
      expect(screen.getByText('Compact mode')).toBeVisible();
      expect(screen.getByText('Sticky first columns')).toBeVisible();
      expect(screen.getByText('Sticky last columns')).toBeVisible();
      expect(screen.getByText('Column preferences')).toBeVisible();
    });

    it('renders expect column preferences', async () => {
      render(
        <AssetPropertyExplorer
          tableSettings={{ isUserSettingsEnabled: true }}
        />
      );

      await table.openUserSettings();

      expect(table.getColumnDisplayCheckbox('Name')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Name')).toBeChecked();
      expect(table.getColumnDisplayCheckbox('Name')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Unit')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Unit')).toBeChecked();
      expect(table.getColumnDisplayCheckbox('Unit')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Data type')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Data type')).toBeChecked();
      expect(table.getColumnDisplayCheckbox('Data type')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Data type spec')).toBeVisible();
      expect(
        table.getColumnDisplayCheckbox('Data type spec')
      ).not.toBeChecked();
      expect(table.getColumnDisplayCheckbox('Data type spec')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('ID')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('ID')).not.toBeChecked();
      expect(table.getColumnDisplayCheckbox('ID')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Alias')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Alias')).not.toBeChecked();
      expect(table.getColumnDisplayCheckbox('Alias')).toBeEnabled();
      expect(
        table.queryColumnDisplayCheckbox('Latest value')
      ).not.toBeInTheDocument();
      expect(
        table.queryColumnDisplayCheckbox('Latest value time')
      ).not.toBeInTheDocument();
    });

    it('renders expect column preferences with latest values enabled', async () => {
      render(
        <AssetPropertyExplorer
          tableSettings={{ isUserSettingsEnabled: true }}
          iotSiteWiseClient={{ batchGetAssetPropertyValue: jest.fn() }}
        />
      );

      await table.openUserSettings();

      expect(table.getColumnDisplayCheckbox('Latest value')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Latest value')).toBeChecked();
      expect(table.getColumnDisplayCheckbox('Latest value')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Latest value time')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Latest value time')).toBeChecked();
      expect(table.getColumnDisplayCheckbox('Latest value time')).toBeEnabled();
    });

    it('supports users changing settings', async () => {
      const user = userEvent.setup();
      render(
        <AssetPropertyExplorer
          tableSettings={{ isUserSettingsEnabled: true }}
        />
      );

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Unit')).toBeVisible();
      expect(screen.getByText('Data type')).toBeVisible();

      await table.openUserSettings();
      await user.click(table.getColumnDisplayCheckbox('Data type'));
      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Unit')).toBeVisible();
      expect(screen.queryByText('Data type')).not.toBeInTheDocument();
    });

    it('supports users cancelling changing settings', async () => {
      const user = userEvent.setup();
      render(
        <AssetPropertyExplorer
          tableSettings={{ isUserSettingsEnabled: true }}
        />
      );

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Unit')).toBeVisible();
      expect(screen.getByText('Data type')).toBeVisible();

      await table.openUserSettings();
      await user.click(table.getColumnDisplayCheckbox('Data type'));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Unit')).toBeVisible();
      expect(screen.getByText('Data type')).toBeVisible();

      await table.openUserSettings();
      await user.click(table.getColumnDisplayCheckbox('Data type'));
      await user.click(screen.getByRole('button', { name: 'Close modal' }));

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Unit')).toBeVisible();
      expect(screen.getByText('Data type')).toBeVisible();
    });
  });

  describe('errors', () => {
    // hide errors in test output
    const realConsoleError = console.error;
    beforeAll(() => {
      console.error = () => {};
    });
    afterAll(() => {
      console.error = realConsoleError;
    });

    test('user experiences an error when listing asset properties', async () => {
      const errorMessage = 'Failed to request resources';
      render(
        <AssetPropertyExplorer
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
          iotSiteWiseClient={{
            listAssetProperties: jest
              .fn()
              .mockRejectedValue(new Error(errorMessage)),
            listAssetModelProperties: jest
              .fn()
              .mockRejectedValue(new Error(errorMessage)),
          }}
        />
      );
      await table.waitForLoadingToFinish();

      const assetPropertyTable = screen.getByRole('table');

      expect(within(assetPropertyTable).getByText(errorMessage)).toBeVisible();
    });

    test('user experiences an error when listing asset model properties', async () => {
      const errorMessage = 'Failed to request resources';
      render(
        <AssetPropertyExplorer
          parameters={[{ assetId: 'asset-id', assetModelId: 'asset-model-id' }]}
          iotSiteWiseClient={{
            listAssetModelProperties: jest
              .fn()
              .mockRejectedValue(new Error(errorMessage)),
          }}
        />
      );
      await table.waitForLoadingToFinish();
      const assetPropertyTable = screen.getByRole('table');

      expect(within(assetPropertyTable).getByText(errorMessage)).toBeVisible();
    });

    test('user experiences an error when searching asset properties', async () => {
      const errorMessage = 'Failed to request resources';
      const executeQuery = jest.fn().mockRejectedValue(new Error(errorMessage));
      render(
        <AssetPropertyExplorer
          iotSiteWiseClient={{ executeQuery }}
          tableSettings={{ isSearchEnabled: true }}
        />
      );
      await table.typeSearchStatement('Asset Property');
      await table.clickSearch();
      const assetPropertyTable = screen.getByRole('table');

      expect(within(assetPropertyTable).getByText(errorMessage)).toBeVisible();
    });
  });
});
