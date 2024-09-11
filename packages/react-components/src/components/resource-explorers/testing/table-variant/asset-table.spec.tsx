import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { AssetExplorer } from '../../explorers';
import { resourceExplorerQueryClient } from '../../requests';
import * as table from '../helpers/table';
import { createListAssetsPage } from '../helpers/responses';
import { SelectionMode } from '../../types/common';
import { ExecuteQuery, ListAssets } from '@iot-app-kit/core';
import { AssetResource } from '../../types/resources';

function SelectableAssetTable({
  selectionMode,
  listAssets,
}: {
  selectionMode?: SelectionMode;
  listAssets: ListAssets;
}) {
  const [selectedAssets, setSelectedAssets] = useState<AssetResource[]>([]);

  return (
    <AssetExplorer
      iotSiteWiseClient={{ listAssets }}
      selectionMode={selectionMode}
      selectedAssets={selectedAssets}
      onSelectAsset={setSelectedAssets}
    />
  );
}

describe('asset table', () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
  });

  describe('rendering', () => {
    it('renders a table without configuration', async () => {
      render(<AssetExplorer />);

      expect(screen.getByRole('table')).toBeVisible();
      expect(screen.getByText(`No assets.`));

      // Title
      expect(screen.getByText('Assets'));
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
      render(<AssetExplorer tableSettings={{ isTitleEnabled: false }} />);

      expect(screen.queryByText('Assets')).not.toBeInTheDocument();
      expect(screen.queryByText('(0)')).not.toBeInTheDocument();
    });

    it('renders with search enabled', () => {
      render(<AssetExplorer tableSettings={{ isSearchEnabled: true }} />);

      expect(table.getSearchField()).toBeVisible();
    });

    it('renders with filter enabled', () => {
      render(<AssetExplorer tableSettings={{ isFilterEnabled: true }} />);

      expect(screen.getByLabelText('Filter')).toBeVisible();
    });

    it('renders with user settings enabled', () => {
      render(<AssetExplorer tableSettings={{ isUserSettingsEnabled: true }} />);

      expect(screen.getByRole('button', { name: 'Preferences' })).toBeVisible();
    });

    it('renders a list of assets', async () => {
      const {
        assetSummaries: [asset1, asset2, asset3],
      } = createListAssetsPage(3);
      const asset1WithHierarchy = {
        ...asset1,
        hierarchies: [{ id: 'hierachy-id', name: 'Hierarchy' }],
      };
      const listAssets = jest.fn().mockResolvedValue({
        assetSummaries: [asset1WithHierarchy, asset2, asset3],
      });
      render(<AssetExplorer iotSiteWiseClient={{ listAssets }} />);

      await table.waitForLoadingToFinish();

      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(screen.getByText(asset1WithHierarchy.name)).toBeVisible();
      expect(
        screen.getByRole('button', { name: asset1WithHierarchy.name })
      ).toBeVisible();
      expect(screen.getByText(asset1WithHierarchy.description)).toBeVisible();
      expect(screen.getByText(asset2.name)).toBeVisible();
      expect(screen.getByText(asset2.description)).toBeVisible();
      expect(
        screen.queryByRole('button', { name: asset2.name })
      ).not.toBeInTheDocument();
      expect(screen.getByText(asset3.name)).toBeVisible();
      expect(screen.getByText(asset3.description)).toBeVisible();
      expect(
        screen.queryByRole('button', { name: asset3.name })
      ).not.toBeInTheDocument();
    });

    it('renders expected columns', () => {
      render(<AssetExplorer />);

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Description')).toBeVisible();
      expect(screen.queryByText('ID')).not.toBeInTheDocument();
      expect(screen.queryByText('Asset model ID')).not.toBeInTheDocument();
    });
  });

  describe('requests', () => {
    it('requests a single page of assets correctly', async () => {
      const listAssets = jest.fn().mockResolvedValue(createListAssetsPage(3));
      render(<AssetExplorer iotSiteWiseClient={{ listAssets }} />);

      await table.waitForLoadingToFinish();

      expect(listAssets).toHaveBeenCalledOnce();
      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeVisible();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).toBeVisible();
      expect(table.getNextPageButton()).toBeDisabled();
    });

    it('requests multiple pages of assets correctly', async () => {
      const listAssets = jest
        .fn()
        .mockResolvedValueOnce(createListAssetsPage(10, 0, 'next-token'))
        .mockResolvedValueOnce(createListAssetsPage(10, 10));
      render(
        <AssetExplorer
          defaultPageSize={10}
          iotSiteWiseClient={{ listAssets }}
        />
      );

      await table.waitForLoadingToFinish();

      expect(listAssets).toHaveBeenCalledOnce();
      expect(screen.getByText('(10)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButtonWithLoading();

      expect(listAssets).toHaveBeenCalledTimes(2);
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).toBeDisabled();

      await table.clickPreviousPageButton();

      expect(listAssets).toHaveBeenCalledTimes(2);
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButton();

      expect(listAssets).toHaveBeenCalledTimes(2);
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).toBeDisabled();
    });

    it('requests multiple lists of pages of assets correctly', async () => {
      const listAssociatedAssets = jest
        .fn()
        .mockResolvedValueOnce(createListAssetsPage(10, 0, 'next-token-1'))
        .mockResolvedValueOnce(createListAssetsPage(5, 10))
        .mockResolvedValueOnce(createListAssetsPage(5, 15, 'next-token-2'))
        .mockResolvedValueOnce(createListAssetsPage(10, 20));
      render(
        <AssetExplorer
          defaultPageSize={10}
          iotSiteWiseClient={{ listAssociatedAssets }}
          parameters={[{ assetId: 'asset-id-1' }, { assetId: 'asset-id-2' }]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(listAssociatedAssets).toHaveBeenCalledOnce();
      expect(screen.getByText('(10)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButtonWithLoading();

      expect(listAssociatedAssets).toHaveBeenCalledTimes(3);
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButtonWithLoading();

      expect(listAssociatedAssets).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).toBeDisabled();

      await table.clickPreviousPageButton();

      expect(listAssociatedAssets).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickPreviousPageButton();

      expect(listAssociatedAssets).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButton();

      expect(listAssociatedAssets).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();
    });
  });

  describe('search', () => {
    it('searches for assets as expected', async () => {
      const executeQuery = jest
        .fn()
        .mockResolvedValue({ rows: [] } satisfies Awaited<
          ReturnType<ExecuteQuery>
        >);
      render(
        <AssetExplorer
          iotSiteWiseClient={{ executeQuery }}
          tableSettings={{ isSearchEnabled: true }}
        />
      );
      await table.typeSearchStatement('Asset');
      await table.clickSearch();

      const queryStatement = executeQuery.mock.calls[0][0].queryStatement;

      expect(queryStatement.replace(/\s/g, '')).toEqual(
        `
          SELECT a.asset_id, a.asset_name, a.asset_description, a.asset_model_id
          FROM asset a
          WHERE a.asset_name LIKE '%Asset%'
        `.replace(/\s/g, '')
      );
    });

    it('supports searching for assets by user', async () => {
      const assetRow1 = {
        data: [
          { scalarValue: 'asset-id-1' },
          { scalarValue: 'Asset 1' },
          { scalarValue: 'Asset Description 1' },
          { scalarValue: 'asset-model-id-1' },
        ],
      };
      const assetRow2 = {
        data: [
          { scalarValue: 'asset-id-2' },
          { scalarValue: 'Asset 2' },
          { scalarValue: 'Asset Description 2' },
          { scalarValue: 'asset-model-id-2' },
        ],
      };
      const assetRow3 = {
        data: [
          { scalarValue: 'asset-id-3' },
          { scalarValue: 'Asset 3' },
          { scalarValue: 'Asset Description 3' },
          { scalarValue: 'asset-model-id-3' },
        ],
      };

      const executeQuery = jest.fn().mockResolvedValue({
        rows: [assetRow1, assetRow2, assetRow3],
      } satisfies Awaited<ReturnType<ExecuteQuery>>);
      render(
        <AssetExplorer
          iotSiteWiseClient={{ executeQuery }}
          tableSettings={{ isSearchEnabled: true }}
        />
      );

      await table.typeSearchStatement('Asset');
      await table.clickSearch();

      // Name is rendered
      expect(screen.getByText(assetRow1.data[1].scalarValue)).toBeVisible();
      expect(screen.getByText(assetRow2.data[1].scalarValue)).toBeVisible();
      expect(screen.getByText(assetRow3.data[1].scalarValue)).toBeVisible();
      // Description is rendered
      expect(screen.getByText(assetRow1.data[2].scalarValue)).toBeVisible();
      expect(screen.getByText(assetRow2.data[2].scalarValue)).toBeVisible();
      expect(screen.getByText(assetRow3.data[2].scalarValue)).toBeVisible();
      // Asset ID is not rendered by default
      expect(
        screen.queryByText(assetRow1.data[0].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetRow2.data[0].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetRow3.data[0].scalarValue)
      ).not.toBeInTheDocument();
      // Asset model ID is not rendered by default
      expect(
        screen.queryByText(assetRow1.data[3].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetRow2.data[3].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetRow3.data[3].scalarValue)
      ).not.toBeInTheDocument();
    });

    it('supports searching for assets with parameters', async () => {
      const assetRow1 = {
        data: [
          { scalarValue: 'asset-id-1' },
          { scalarValue: 'Asset 1' },
          { scalarValue: 'Asset Description 1' },
          { scalarValue: 'asset-model-id-1' },
        ],
      };
      const assetRow2 = {
        data: [
          { scalarValue: 'asset-id-2' },
          { scalarValue: 'Asset 2' },
          { scalarValue: 'Asset Description 2' },
          { scalarValue: 'asset-model-id-2' },
        ],
      };
      const assetRow3 = {
        data: [
          { scalarValue: 'asset-id-3' },
          { scalarValue: 'Asset 3' },
          { scalarValue: 'Asset Description 3' },
          { scalarValue: 'asset-model-id-3' },
        ],
      };

      const executeQuery = jest.fn().mockResolvedValue({
        rows: [assetRow1, assetRow2, assetRow3],
      } satisfies Awaited<ReturnType<ExecuteQuery>>);
      render(
        <AssetExplorer
          iotSiteWiseClient={{ executeQuery }}
          parameters={[{ searchStatement: 'Asset' }]}
          tableSettings={{ isSearchEnabled: true }}
        />
      );

      await table.waitForLoadingToFinish();

      // Name is rendered
      expect(screen.getByText(assetRow1.data[1].scalarValue)).toBeVisible();
      expect(screen.getByText(assetRow2.data[1].scalarValue)).toBeVisible();
      expect(screen.getByText(assetRow3.data[1].scalarValue)).toBeVisible();
      // Description is rendered
      expect(screen.getByText(assetRow1.data[2].scalarValue)).toBeVisible();
      expect(screen.getByText(assetRow2.data[2].scalarValue)).toBeVisible();
      expect(screen.getByText(assetRow3.data[2].scalarValue)).toBeVisible();
      // Asset ID is not rendered by default
      expect(
        screen.queryByText(assetRow1.data[0].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetRow2.data[0].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetRow3.data[0].scalarValue)
      ).not.toBeInTheDocument();
      // Asset model ID is not rendered by default
      expect(
        screen.queryByText(assetRow1.data[3].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetRow2.data[3].scalarValue)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(assetRow3.data[3].scalarValue)
      ).not.toBeInTheDocument();
    });

    it('initiates search when user presses enter/return key', async () => {
      const executeQuery = jest
        .fn()
        .mockResolvedValue({ rows: [] } satisfies Awaited<
          ReturnType<ExecuteQuery>
        >);
      render(
        <AssetExplorer
          iotSiteWiseClient={{ executeQuery }}
          tableSettings={{ isSearchEnabled: true }}
        />
      );
      await table.typeSearchStatement('Asset');
      await table.pressReturnKeyToSearch();

      expect(executeQuery).toHaveBeenCalledOnce();
    });
  });

  describe('selection', () => {
    it('does not allow selecting assets if selectionMode is undefined', async () => {
      const listAssets = jest.fn().mockResolvedValue(createListAssetsPage(3));

      render(<SelectableAssetTable listAssets={listAssets} />);

      await table.waitForLoadingToFinish();

      expect(screen.queryAllByRole('radio')).toHaveLength(0);
      expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });

    describe('single-select', () => {
      it('allows selecting a single asset', async () => {
        const listAssets = jest.fn().mockResolvedValue(createListAssetsPage(3));
        const user = userEvent.setup();
        render(
          <SelectableAssetTable
            selectionMode='single'
            listAssets={listAssets}
          />
        );

        await table.waitForLoadingToFinish();

        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
        const radios = screen.queryAllByRole('radio');
        expect(radios).toHaveLength(3);
        const [assetRadio1, assetRadio2, assetRadio3] = radios;

        expect(assetRadio1).not.toBeChecked();
        expect(assetRadio2).not.toBeChecked();
        expect(assetRadio3).not.toBeChecked();

        await user.click(assetRadio1);

        expect(assetRadio1).toBeChecked();
        expect(assetRadio2).not.toBeChecked();
        expect(assetRadio3).not.toBeChecked();

        await user.click(assetRadio2);

        expect(assetRadio1).not.toBeChecked();
        expect(assetRadio2).toBeChecked();
        expect(assetRadio3).not.toBeChecked();

        await user.click(assetRadio3);

        expect(assetRadio1).not.toBeChecked();
        expect(assetRadio2).not.toBeChecked();
        expect(assetRadio3).toBeChecked();
      });
    });

    describe('multi-select', () => {
      it('allows selecting multiple assets', async () => {
        const listAssets = jest.fn().mockResolvedValue(createListAssetsPage(3));
        const user = userEvent.setup();
        render(
          <SelectableAssetTable selectionMode='multi' listAssets={listAssets} />
        );

        await table.waitForLoadingToFinish();

        expect(screen.queryAllByRole('radio')).toHaveLength(0);
        const checkboxes = screen.queryAllByRole('checkbox');
        expect(checkboxes).toHaveLength(4);
        const [
          allAssetsCheckbox,
          assetCheckbox1,
          assetCheckbox2,
          assetCheckbox3,
        ] = checkboxes;

        expect(allAssetsCheckbox).not.toBeChecked();
        expect(allAssetsCheckbox).not.toBePartiallyChecked();
        expect(assetCheckbox1).not.toBeChecked();
        expect(assetCheckbox2).not.toBeChecked();
        expect(assetCheckbox3).not.toBeChecked();

        await user.click(assetCheckbox1);

        expect(allAssetsCheckbox).not.toBeChecked();
        expect(allAssetsCheckbox).toBePartiallyChecked();
        expect(assetCheckbox1).toBeChecked();
        expect(assetCheckbox2).not.toBeChecked();
        expect(assetCheckbox3).not.toBeChecked();

        await user.click(assetCheckbox2);

        expect(allAssetsCheckbox).not.toBeChecked();
        expect(allAssetsCheckbox).toBePartiallyChecked();
        expect(assetCheckbox1).toBeChecked();
        expect(assetCheckbox2).toBeChecked();
        expect(assetCheckbox3).not.toBeChecked();

        await user.click(assetCheckbox3);

        expect(allAssetsCheckbox).toBeChecked();
        expect(allAssetsCheckbox).not.toBePartiallyChecked();
        expect(assetCheckbox1).toBeChecked();
        expect(assetCheckbox2).toBeChecked();
        expect(assetCheckbox3).toBeChecked();

        await user.click(assetCheckbox1);

        expect(allAssetsCheckbox).not.toBeChecked();
        expect(allAssetsCheckbox).toBePartiallyChecked();
        expect(assetCheckbox1).not.toBeChecked();
        expect(assetCheckbox2).toBeChecked();
        expect(assetCheckbox3).toBeChecked();

        await user.click(assetCheckbox2);

        expect(allAssetsCheckbox).not.toBeChecked();
        expect(allAssetsCheckbox).toBePartiallyChecked();
        expect(assetCheckbox1).not.toBeChecked();
        expect(assetCheckbox2).not.toBeChecked();
        expect(assetCheckbox3).toBeChecked();

        await user.click(assetCheckbox3);

        expect(allAssetsCheckbox).not.toBeChecked();
        expect(allAssetsCheckbox).not.toBePartiallyChecked();
        expect(assetCheckbox1).not.toBeChecked();
        expect(assetCheckbox2).not.toBeChecked();
        expect(assetCheckbox3).not.toBeChecked();
      });
    });
  });

  describe('filtering', () => {
    it('supports filtering by property', async () => {
      const listAssets = jest.fn().mockResolvedValue(createListAssetsPage(3));
      render(
        <AssetExplorer
          tableSettings={{ isFilterEnabled: true }}
          iotSiteWiseClient={{ listAssets }}
        />
      );

      await table.waitForLoadingToFinish();
      await table.openFilterControls();

      expect(screen.getByRole('option', { name: 'Name' })).toBeVisible();
      expect(screen.getByRole('option', { name: 'Description' })).toBeVisible();
      expect(screen.getByRole('option', { name: 'ID' })).toBeVisible();
      expect(
        screen.getByRole('option', { name: 'Asset model ID' })
      ).toBeVisible();
    });

    it('supports filtering by text', async () => {
      const listAssetsResponse = createListAssetsPage(3);
      const asset1 = {
        ...listAssetsResponse.assetSummaries[0],
        name: 'Similar Name 1',
      };
      const asset2 = {
        ...listAssetsResponse.assetSummaries[1],
        name: 'Similar Name 2',
      };
      const asset3 = {
        ...listAssetsResponse.assetSummaries[2],
        name: 'Different Name 3',
      };
      const listAssets = jest.fn().mockResolvedValue({
        assetSummaries: [asset1, asset2, asset3],
      });
      const user = userEvent.setup();
      render(
        <AssetExplorer
          tableSettings={{ isFilterEnabled: true }}
          iotSiteWiseClient={{ listAssets }}
        />
      );

      await table.waitForLoadingToFinish();

      expect(screen.getByText(asset1.name)).toBeVisible();
      expect(screen.getByText(asset2.name)).toBeVisible();
      expect(screen.getByText(asset3.name)).toBeVisible();

      await table.openFilterControls();
      await user.keyboard('Similar');
      await user.click(screen.getByText('Use: "Similar"'));

      expect(screen.getByText(asset1.name)).toBeVisible();
      expect(screen.getByText(asset2.name)).toBeVisible();
      expect(screen.queryByText(asset3.name)).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Clear filters' }));

      expect(screen.getByText(asset1.name)).toBeVisible();
      expect(screen.getByText(asset2.name)).toBeVisible();
      expect(screen.getByText(asset3.name)).toBeVisible();
    });
  });

  describe('user settings', () => {
    it('renders user settings as expected', async () => {
      const user = userEvent.setup();
      render(<AssetExplorer tableSettings={{ isUserSettingsEnabled: true }} />);

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
      render(<AssetExplorer tableSettings={{ isUserSettingsEnabled: true }} />);

      await table.openUserSettings();

      expect(table.getColumnDisplayCheckbox('Name')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Name')).toBeChecked();
      expect(table.getColumnDisplayCheckbox('Name')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Description')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('Description')).toBeChecked();
      expect(table.getColumnDisplayCheckbox('Description')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('ID')).toBeVisible();
      expect(table.getColumnDisplayCheckbox('ID')).not.toBeChecked();
      expect(table.getColumnDisplayCheckbox('ID')).toBeEnabled();
      expect(table.getColumnDisplayCheckbox('Asset model ID')).toBeVisible();
      expect(
        table.getColumnDisplayCheckbox('Asset model ID')
      ).not.toBeChecked();
      expect(table.getColumnDisplayCheckbox('Asset model ID')).toBeEnabled();
    });

    it('supports users changing settings', async () => {
      const user = userEvent.setup();
      render(<AssetExplorer tableSettings={{ isUserSettingsEnabled: true }} />);

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Description')).toBeVisible();

      await table.openUserSettings();
      await user.click(table.getColumnDisplayCheckbox('Description'));
      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('supports users cancelling changing settings', async () => {
      const user = userEvent.setup();
      render(<AssetExplorer tableSettings={{ isUserSettingsEnabled: true }} />);

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Description')).toBeVisible();

      await table.openUserSettings();
      await user.click(table.getColumnDisplayCheckbox('Description'));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Description')).toBeVisible();

      await table.openUserSettings();
      await user.click(table.getColumnDisplayCheckbox('Description'));
      await user.click(screen.getByRole('button', { name: 'Close modal' }));

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Description')).toBeVisible();
    });
  });
});
