import type { ListAssetModels } from '@iot-app-kit/core';
import { render, screen, within } from '@testing-library/react';
import ue from '@testing-library/user-event';
import { useState } from 'react';
import { AssetModelExplorer } from '../../explorers';
import { resourceExplorerQueryClient } from '../../requests';
import type { SelectionMode } from '../../types/common';
import type { AssetModelResource } from '../../types/resources';
import { createListAssetModelsPage } from '../helpers/responses';
import * as table from '../helpers/table';

function SelectableAssetModelTable({
  selectionMode,
  listAssetModels,
}: {
  selectionMode?: SelectionMode;
  listAssetModels: ListAssetModels;
}) {
  const [selectedAssetModels, setSelectedAssetModels] = useState<
    AssetModelResource[]
  >([]);

  return (
    <AssetModelExplorer
      iotSiteWiseClient={{ listAssetModels }}
      selectionMode={selectionMode}
      selectedAssetModels={selectedAssetModels}
      onSelectAssetModel={setSelectedAssetModels}
    />
  );
}

describe('asset model table', () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
  });

  describe('rendering', () => {
    it('renders a table without configuration', () => {
      render(<AssetModelExplorer />);

      expect(screen.getByRole('table')).toBeVisible();
      expect(screen.getByText(`No asset models.`));

      // Title
      expect(screen.getByText('Asset models')).toBeVisible();
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
      render(<AssetModelExplorer tableSettings={{ isTitleEnabled: false }} />);

      expect(screen.queryByText('Asset models')).not.toBeInTheDocument();
      expect(screen.queryByText('(0)')).not.toBeInTheDocument();
    });

    it('renders with filter enabled', () => {
      render(<AssetModelExplorer tableSettings={{ isFilterEnabled: true }} />);

      expect(screen.getByLabelText('Filter')).toBeVisible();
    });

    it('renders with user settings enabled', () => {
      render(
        <AssetModelExplorer tableSettings={{ isUserSettingsEnabled: true }} />
      );

      expect(screen.getByRole('button', { name: 'Preferences' })).toBeVisible();
    });

    it('renders a list of asset models', async () => {
      const listAssetModelsResponse = createListAssetModelsPage(3);
      const {
        assetModelSummaries: [assetModel1, assetModel2, assetModel3],
      } = listAssetModelsResponse;
      const listAssetModels = vi
        .fn()
        .mockResolvedValue(listAssetModelsResponse);
      render(<AssetModelExplorer iotSiteWiseClient={{ listAssetModels }} />);

      await table.waitForLoadingToFinish();

      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(screen.getByText(assetModel1.name)).toBeVisible();
      expect(screen.getByText(assetModel1.description)).toBeVisible();
      expect(screen.getByText(assetModel2.name)).toBeVisible();
      expect(screen.getByText(assetModel2.description)).toBeVisible();
      expect(screen.getByText(assetModel3.name)).toBeVisible();
      expect(screen.getByText(assetModel3.description)).toBeVisible();
    });

    it('renders expected columns', () => {
      render(<AssetModelExplorer />);

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Description')).toBeVisible();
      expect(screen.queryByText('ID')).not.toBeInTheDocument();
    });
  });

  describe('requests', () => {
    it('requests a single page of asset models correctly', async () => {
      const listAssetModels = vi
        .fn()
        .mockResolvedValue(createListAssetModelsPage(3));
      render(<AssetModelExplorer iotSiteWiseClient={{ listAssetModels }} />);

      await table.waitForLoadingToFinish();

      expect(listAssetModels).toHaveBeenCalledOnce();
      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeVisible();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).toBeVisible();
      expect(table.getNextPageButton()).toBeDisabled();
    });

    it('requests multiple pages of asset models correctly', async () => {
      const listAssetModels = vi
        .fn()
        .mockResolvedValueOnce(createListAssetModelsPage(10, 0, 'next-token'))
        .mockResolvedValueOnce(createListAssetModelsPage(10, 10));
      render(
        <AssetModelExplorer
          defaultPageSize={10}
          iotSiteWiseClient={{ listAssetModels }}
        />
      );

      await table.waitForLoadingToFinish();

      expect(listAssetModels).toHaveBeenCalledTimes(2);
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButton();

      expect(listAssetModels).toHaveBeenCalledTimes(2);
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).toBeDisabled();

      await table.clickPreviousPageButton();

      expect(listAssetModels).toHaveBeenCalledTimes(2);
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButton();

      expect(listAssetModels).toHaveBeenCalledTimes(2);
      expect(screen.getByText('(20)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).toBeDisabled();
    });

    it('requests multiple lists of pages of asset models correctly', async () => {
      const listAssetModels = vi
        .fn()
        .mockResolvedValueOnce(createListAssetModelsPage(10, 0, 'next-token-1'))
        .mockResolvedValueOnce(createListAssetModelsPage(5, 10))
        .mockResolvedValueOnce(createListAssetModelsPage(5, 15, 'next-token-2'))
        .mockResolvedValueOnce(createListAssetModelsPage(10, 20));
      render(
        <AssetModelExplorer
          defaultPageSize={10}
          iotSiteWiseClient={{ listAssetModels }}
          parameters={[
            { assetModelTypes: ['ASSET_MODEL'] },
            { assetModelTypes: ['COMPONENT_MODEL'] },
          ]}
        />
      );

      await table.waitForLoadingToFinish();

      expect(listAssetModels).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButton();

      expect(listAssetModels).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButton();

      expect(listAssetModels).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).toBeDisabled();

      await table.clickPreviousPageButton();

      expect(listAssetModels).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickPreviousPageButton();

      expect(listAssetModels).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();

      await table.clickNextPageButton();

      expect(listAssetModels).toHaveBeenCalledTimes(4);
      expect(screen.getByText('(30)')).toBeInTheDocument();
      expect(table.getPreviousPageButton()).not.toBeDisabled();
      expect(table.getNextPageButton()).not.toBeDisabled();
    });
  });

  describe('selection', () => {
    it('does not allow selecting asset models if selectionMode is undefined', async () => {
      const listAssetModels = vi
        .fn()
        .mockResolvedValue(createListAssetModelsPage(3));

      render(<SelectableAssetModelTable listAssetModels={listAssetModels} />);

      await table.waitForLoadingToFinish();

      expect(screen.queryAllByRole('radio')).toHaveLength(0);
      expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });

    describe('single-select', () => {
      it('allows selecting a single asset model', async () => {
        const listAssetModels = vi
          .fn()
          .mockResolvedValue(createListAssetModelsPage(3));
        const user = ue.setup();
        render(
          <SelectableAssetModelTable
            selectionMode='single'
            listAssetModels={listAssetModels}
          />
        );

        await table.waitForLoadingToFinish();

        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
        const radios = screen.queryAllByRole('radio');
        expect(radios).toHaveLength(3);
        const [assetModelRadio1, assetModelRadio2, assetModelRadio3] = radios;

        expect(assetModelRadio1).not.toBeChecked();
        expect(assetModelRadio2).not.toBeChecked();
        expect(assetModelRadio3).not.toBeChecked();

        await user.click(assetModelRadio1);

        expect(assetModelRadio1).toBeChecked();
        expect(assetModelRadio2).not.toBeChecked();
        expect(assetModelRadio3).not.toBeChecked();

        await user.click(assetModelRadio2);

        expect(assetModelRadio1).not.toBeChecked();
        expect(assetModelRadio2).toBeChecked();
        expect(assetModelRadio3).not.toBeChecked();

        await user.click(assetModelRadio3);

        expect(assetModelRadio1).not.toBeChecked();
        expect(assetModelRadio2).not.toBeChecked();
        expect(assetModelRadio3).toBeChecked();
      });
    });

    describe('multi-select', () => {
      it('allows selecting multiple asset models', async () => {
        const listAssetModels = vi
          .fn()
          .mockResolvedValue(createListAssetModelsPage(3));
        const user = ue.setup();
        render(
          <SelectableAssetModelTable
            selectionMode='multi'
            listAssetModels={listAssetModels}
          />
        );

        await table.waitForLoadingToFinish();

        expect(screen.queryAllByRole('radio')).toHaveLength(0);
        const checkboxes = screen.queryAllByRole('checkbox');
        expect(checkboxes).toHaveLength(4);
        const [
          allAssetModelsCheckbox,
          assetModelCheckbox1,
          assetModelCheckbox2,
          assetModelCheckbox3,
        ] = checkboxes;

        expect(allAssetModelsCheckbox).not.toBeChecked();
        expect(allAssetModelsCheckbox).not.toBePartiallyChecked();
        expect(assetModelCheckbox1).not.toBeChecked();
        expect(assetModelCheckbox2).not.toBeChecked();
        expect(assetModelCheckbox3).not.toBeChecked();

        await user.click(assetModelCheckbox1);

        expect(allAssetModelsCheckbox).not.toBeChecked();
        expect(allAssetModelsCheckbox).toBePartiallyChecked();
        expect(assetModelCheckbox1).toBeChecked();
        expect(assetModelCheckbox2).not.toBeChecked();
        expect(assetModelCheckbox3).not.toBeChecked();

        await user.click(assetModelCheckbox2);

        expect(allAssetModelsCheckbox).not.toBeChecked();
        expect(allAssetModelsCheckbox).toBePartiallyChecked();
        expect(assetModelCheckbox1).toBeChecked();
        expect(assetModelCheckbox2).toBeChecked();
        expect(assetModelCheckbox3).not.toBeChecked();

        await user.click(assetModelCheckbox3);

        expect(allAssetModelsCheckbox).toBeChecked();
        expect(allAssetModelsCheckbox).not.toBePartiallyChecked();
        expect(assetModelCheckbox1).toBeChecked();
        expect(assetModelCheckbox2).toBeChecked();
        expect(assetModelCheckbox3).toBeChecked();

        await user.click(assetModelCheckbox1);

        expect(allAssetModelsCheckbox).not.toBeChecked();
        expect(allAssetModelsCheckbox).toBePartiallyChecked();
        expect(assetModelCheckbox1).not.toBeChecked();
        expect(assetModelCheckbox2).toBeChecked();
        expect(assetModelCheckbox3).toBeChecked();

        await user.click(assetModelCheckbox2);

        expect(allAssetModelsCheckbox).not.toBeChecked();
        expect(allAssetModelsCheckbox).toBePartiallyChecked();
        expect(assetModelCheckbox1).not.toBeChecked();
        expect(assetModelCheckbox2).not.toBeChecked();
        expect(assetModelCheckbox3).toBeChecked();

        await user.click(assetModelCheckbox3);

        expect(allAssetModelsCheckbox).not.toBeChecked();
        expect(allAssetModelsCheckbox).not.toBePartiallyChecked();
        expect(assetModelCheckbox1).not.toBeChecked();
        expect(assetModelCheckbox2).not.toBeChecked();
        expect(assetModelCheckbox3).not.toBeChecked();
      });
    });
  });

  describe('filtering', () => {
    it('supports filtering by property', async () => {
      const listAssetModels = vi
        .fn()
        .mockResolvedValue(createListAssetModelsPage(3));
      render(
        <AssetModelExplorer
          tableSettings={{ isFilterEnabled: true }}
          iotSiteWiseClient={{ listAssetModels }}
        />
      );

      await table.waitForLoadingToFinish();
      await table.openFilterControls();

      expect(screen.getByRole('option', { name: 'Name' })).toBeVisible();
      expect(screen.getByRole('option', { name: 'Description' })).toBeVisible();
      expect(screen.getByRole('option', { name: 'ID' })).toBeVisible();
    });

    it('supports filtering by text', async () => {
      const listAssetModelsResponse = createListAssetModelsPage(3);
      const assetModel1 = {
        ...listAssetModelsResponse.assetModelSummaries[0],
        name: 'Similar Name 1',
      };
      const assetModel2 = {
        ...listAssetModelsResponse.assetModelSummaries[1],
        name: 'Similar Name 2',
      };
      const assetModel3 = {
        ...listAssetModelsResponse.assetModelSummaries[2],
        name: 'Different Name 3',
      };
      const listAssetModels = vi.fn().mockResolvedValue({
        assetModelSummaries: [assetModel1, assetModel2, assetModel3],
      });
      const user = ue.setup();
      render(
        <AssetModelExplorer
          tableSettings={{ isFilterEnabled: true }}
          iotSiteWiseClient={{ listAssetModels }}
        />
      );

      await table.waitForLoadingToFinish();

      expect(screen.getByText(assetModel1.name)).toBeVisible();
      expect(screen.getByText(assetModel2.name)).toBeVisible();
      expect(screen.getByText(assetModel3.name)).toBeVisible();

      await table.openFilterControls();
      await user.keyboard('Similar');
      await user.click(screen.getByText('Use: "Similar"'));

      expect(screen.getByText(assetModel1.name)).toBeVisible();
      expect(screen.getByText(assetModel2.name)).toBeVisible();
      expect(screen.queryByText(assetModel3.name)).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Clear filters' }));

      expect(screen.getByText(assetModel1.name)).toBeVisible();
      expect(screen.getByText(assetModel2.name)).toBeVisible();
      expect(screen.getByText(assetModel3.name)).toBeVisible();
    });
  });

  describe('user settings', () => {
    it('renders user settings as expected', async () => {
      const user = ue.setup();
      render(
        <AssetModelExplorer tableSettings={{ isUserSettingsEnabled: true }} />
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
        <AssetModelExplorer tableSettings={{ isUserSettingsEnabled: true }} />
      );

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
    });

    it('supports users changing settings', async () => {
      const user = ue.setup();
      render(
        <AssetModelExplorer tableSettings={{ isUserSettingsEnabled: true }} />
      );

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.getByText('Description')).toBeVisible();

      await table.openUserSettings();
      await user.click(table.getColumnDisplayCheckbox('Description'));
      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(screen.getByText('Name')).toBeVisible();
      expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    it('supports users cancelling changing settings', async () => {
      const user = ue.setup();
      render(
        <AssetModelExplorer tableSettings={{ isUserSettingsEnabled: true }} />
      );

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

  describe('errors', () => {
    // hide errors in test output
    const realConsoleError = console.error;
    beforeAll(() => {
      console.error = () => {};
    });
    afterAll(() => {
      console.error = realConsoleError;
    });

    test('user experiences an error when listing asset models', async () => {
      const errorMessage = 'Failed to request resources';
      render(
        <AssetModelExplorer
          iotSiteWiseClient={{
            listAssetModels: vi.fn().mockRejectedValue(new Error(errorMessage)),
          }}
        />
      );
      await table.waitForLoadingToFinish();
      const assetModelTable = screen.getByRole('table');

      expect(within(assetModelTable).getByText(errorMessage)).toBeVisible();
    });
  });
});
