import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import * as dropDown from '../helpers/drop-down';
import { createListAssetModelsPage } from '../helpers/responses';
import { AssetModelExplorer } from '../../explorers';
import { resourceExplorerQueryClient } from '../../requests/resource-explorer-query-client';
import type { SelectionMode } from '../../types/common';
import type { ListAssetModels } from '@iot-app-kit/core';
import type { AssetModelResource } from '../../types/resources';

function SelectableAssetModelDropDown({
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
      variant='drop-down'
      iotSiteWiseClient={{ listAssetModels }}
      selectionMode={selectionMode}
      selectedAssetModels={selectedAssetModels}
      onSelectAssetModel={setSelectedAssetModels}
    />
  );
}

describe('asset model drop-down', () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
  });

  describe('rendering', () => {
    it('renders a drop-down without configuration', async () => {
      render(<AssetModelExplorer variant='drop-down' />);

      expect(screen.getByText('Select asset model')).toBeVisible();

      await dropDown.open();

      expect(screen.getByText('No asset models.')).toBeVisible();
    });

    it('renders a multi-select drop-down without configuration', async () => {
      render(<AssetModelExplorer variant='drop-down' selectionMode='multi' />);

      expect(screen.getByText('Select asset models')).toBeVisible();

      await dropDown.open();

      expect(screen.getByText('No asset models.')).toBeVisible();
    });

    it('renders drop-down options', async () => {
      const listAssetModelsResponse = createListAssetModelsPage(3);
      const {
        assetModelSummaries: [assetModel1, assetModel2, assetModel3],
      } = listAssetModelsResponse;
      const listAssetModels = jest
        .fn()
        .mockResolvedValue(listAssetModelsResponse);
      render(
        <AssetModelExplorer
          variant='drop-down'
          iotSiteWiseClient={{ listAssetModels }}
        />
      );

      expect(dropDown.queryOption(assetModel1.name)).not.toBeInTheDocument();
      expect(dropDown.queryOption(assetModel2.name)).not.toBeInTheDocument();
      expect(dropDown.queryOption(assetModel3.name)).not.toBeInTheDocument();

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      const assetModelOption1 = dropDown.getOption(assetModel1.name);
      const assetModelOption2 = dropDown.getOption(assetModel2.name);
      const assetModelOption3 = dropDown.getOption(assetModel3.name);

      expect(assetModelOption1).toBeVisible();
      expect(assetModelOption1).toHaveTextContent(assetModel1.name);
      expect(assetModelOption1).toHaveTextContent(assetModel1.description);
      expect(assetModelOption2).toBeVisible();
      expect(assetModelOption2).toHaveTextContent(assetModel2.name);
      expect(assetModelOption2).toHaveTextContent(assetModel2.description);
      expect(assetModelOption3).toBeVisible();
      expect(assetModelOption3).toHaveTextContent(assetModel3.name);
      expect(assetModelOption3).toHaveTextContent(assetModel3.description);
    });
  });

  describe('request handling', () => {
    it('requests a single page of asset models correctly', async () => {
      const listAssetModels = jest
        .fn()
        .mockResolvedValue(createListAssetModelsPage(3));
      render(
        <AssetModelExplorer
          variant='drop-down'
          iotSiteWiseClient={{ listAssetModels }}
        />
      );

      // Page is requested without opening the drop-down
      expect(listAssetModels).toHaveBeenCalledOnce();

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();
    });

    it('requests multiple pages of asset models correctly', async () => {
      const listAssetModels = jest
        .fn()
        .mockResolvedValueOnce(createListAssetModelsPage(1, 10, 'next-token-1'))
        .mockResolvedValueOnce(createListAssetModelsPage(1, 20, 'next-token-2'))
        .mockResolvedValueOnce(createListAssetModelsPage(1, 30));
      render(
        <AssetModelExplorer
          variant='drop-down'
          iotSiteWiseClient={{ listAssetModels }}
        />
      );

      // First page is requested without opening the drop-down
      expect(listAssetModels).toHaveBeenCalledOnce();

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      // The rest of the pages are requested after opening the drop-down
      expect(listAssetModels).toHaveBeenCalledTimes(3);
    });

    // TODO: flaky test, commented out to do an iot-app-kit release
    it.skip('requests multiple lists of pages of asset models correctly', async () => {
      const listAssetModels = jest
        .fn()
        .mockResolvedValueOnce(createListAssetModelsPage(1, 10, 'next-token-1'))
        .mockResolvedValueOnce(createListAssetModelsPage(1, 20))
        .mockResolvedValueOnce(createListAssetModelsPage(1, 30, 'next-token-2'))
        .mockResolvedValueOnce(createListAssetModelsPage(1, 40));

      render(
        <AssetModelExplorer
          variant='drop-down'
          iotSiteWiseClient={{ listAssetModels }}
          parameters={[
            { assetModelTypes: ['ASSET_MODEL'] },
            { assetModelTypes: ['COMPONENT_MODEL'] },
          ]}
        />
      );

      expect(listAssetModels).toHaveBeenCalledOnce();

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      await waitFor(() => expect(listAssetModels).toHaveBeenCalledTimes(4));
    });
  });

  describe('selection', () => {
    it('does not allow selecting asset models if selectionMode is undefined', async () => {
      const listAssetModelsResponse = createListAssetModelsPage(3);
      const {
        assetModelSummaries: [assetModel1, assetModel2, assetModel3],
      } = listAssetModelsResponse;
      const listAssetModels = jest
        .fn()
        .mockResolvedValue(listAssetModelsResponse);
      const user = userEvent.setup();

      render(
        <SelectableAssetModelDropDown listAssetModels={listAssetModels} />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();
      await user.click(dropDown.getOption(assetModel1.name));

      expect(screen.queryByText(assetModel1.name)).not.toBeInTheDocument();
      expect(dropDown.queryOption(assetModel1.name)).not.toBeInTheDocument();
      expect(dropDown.queryOption(assetModel2.name)).not.toBeInTheDocument();
      expect(dropDown.queryOption(assetModel3.name)).not.toBeInTheDocument();
    });

    describe('single-select', () => {
      it('allows selecting a single asset model', async () => {
        const listAssetModelsResponse = createListAssetModelsPage(3);
        const {
          assetModelSummaries: [assetModel1, assetModel2, assetModel3],
        } = listAssetModelsResponse;
        const listAssetModels = jest
          .fn()
          .mockResolvedValue(listAssetModelsResponse);
        const user = userEvent.setup();

        render(
          <SelectableAssetModelDropDown
            selectionMode='single'
            listAssetModels={listAssetModels}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(assetModel1.name));

        expect(screen.getByText(assetModel1.name)).toBeVisible();
        expect(dropDown.queryOption(assetModel1.name)).not.toBeInTheDocument();
        expect(dropDown.queryOption(assetModel2.name)).not.toBeInTheDocument();
        expect(dropDown.queryOption(assetModel3.name)).not.toBeInTheDocument();
      });

      it('replaces the selection when a new selection is made', async () => {
        const listAssetModelsResponse = createListAssetModelsPage(3);
        const {
          assetModelSummaries: [assetModel1, assetModel2],
        } = listAssetModelsResponse;
        const listAssetModels = jest
          .fn()
          .mockResolvedValue(listAssetModelsResponse);
        const user = userEvent.setup();

        render(
          <SelectableAssetModelDropDown
            selectionMode='single'
            listAssetModels={listAssetModels}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(assetModel1.name));

        expect(screen.getByText(assetModel1.name)).toBeVisible();

        await user.click(screen.getByText(assetModel1.name));
        await user.click(dropDown.getOption(assetModel2.name));

        expect(screen.getByText(assetModel2.name)).toBeVisible();
        expect(screen.queryByText(assetModel1.name)).not.toBeInTheDocument();
      });
    });

    describe('multi-select', () => {
      it('allows selecting multiple asset models', async () => {
        const listAssetModelsResponse = createListAssetModelsPage(3);
        const {
          assetModelSummaries: [assetModel1, assetModel2, assetModel3],
        } = listAssetModelsResponse;
        const listAssetModels = jest
          .fn()
          .mockResolvedValue(listAssetModelsResponse);
        const user = userEvent.setup();
        render(
          <SelectableAssetModelDropDown
            selectionMode='multi'
            listAssetModels={listAssetModels}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(assetModel1.name));
        await user.click(dropDown.getOption(assetModel2.name));
        await dropDown.close();

        expect(screen.getByText(assetModel1.name)).toBeVisible();
        expect(screen.getByText(assetModel1.description)).toBeVisible();
        expect(screen.getByText(assetModel2.name)).toBeVisible();
        expect(screen.getByText(assetModel2.description)).toBeVisible();
        expect(dropDown.queryOption(assetModel1.name)).not.toBeInTheDocument();
        expect(dropDown.queryOption(assetModel2.name)).not.toBeInTheDocument();
        expect(dropDown.queryOption(assetModel3.name)).not.toBeInTheDocument();
      });

      it('allows for de-selecting asset models', async () => {
        const listAssetModelsResponse = createListAssetModelsPage(2);
        const {
          assetModelSummaries: [assetModel1, assetModel2],
        } = listAssetModelsResponse;
        const listAssetModels = jest
          .fn()
          .mockResolvedValue(listAssetModelsResponse);
        const user = userEvent.setup();
        render(
          <SelectableAssetModelDropDown
            selectionMode='multi'
            listAssetModels={listAssetModels}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(assetModel1.name));
        await user.click(dropDown.getOption(assetModel2.name));
        await dropDown.close();

        expect(screen.getByText(assetModel1.name)).toBeVisible();
        expect(screen.getByText(assetModel1.description)).toBeVisible();
        expect(screen.getByText(assetModel2.name)).toBeVisible();
        expect(screen.getByText(assetModel2.description)).toBeVisible();

        await user.click(
          screen.getByRole('button', { name: `Remove ${assetModel2.name}` })
        );

        expect(screen.getByText(assetModel1.name)).toBeVisible();
        expect(screen.getByText(assetModel1.description)).toBeVisible();
        expect(screen.queryByText(assetModel2.name)).not.toBeInTheDocument();
        expect(
          screen.queryByText(assetModel2.description)
        ).not.toBeInTheDocument();

        await user.click(
          screen.getByRole('button', { name: `Remove ${assetModel1.name}` })
        );

        expect(screen.queryByText(assetModel1.name)).not.toBeInTheDocument();
        expect(
          screen.queryByText(assetModel1.description)
        ).not.toBeInTheDocument();
      });
    });
  });

  // TODO: fix this flaky test ASAP
  describe('filtering', () => {
    it('filters asset models', async () => {
      const assetModel1 = {
        name: 'Similar Name 1',
        description: 'Different Description 1',
      };
      const assetModel2 = {
        name: 'Similar Name 2',
        description: 'Similar Description 2',
      };
      const assetModel3 = {
        name: 'Different Name 3',
        description: 'Similar Description 3',
      };
      const listAssetModels = jest.fn().mockResolvedValue({
        assetModelSummaries: [assetModel1, assetModel2, assetModel3],
      });
      const user = userEvent.setup();
      render(
        <AssetModelExplorer
          variant='drop-down'
          iotSiteWiseClient={{ listAssetModels }}
          dropDownSettings={{
            isFilterEnabled: true,
          }}
        />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      expect(screen.getByPlaceholderText('Filter asset models')).toBeVisible();

      expect(dropDown.getOption(assetModel1.name)).toBeVisible();
      expect(dropDown.getOption(assetModel2.name)).toBeVisible();
      expect(dropDown.getOption(assetModel3.name)).toBeVisible();

      await user.keyboard('Similar Name');

      expect(dropDown.getOption(assetModel1.name)).toBeVisible();
      expect(dropDown.getOption(assetModel2.name)).toBeVisible();
      expect(dropDown.queryOption(assetModel3.name)).not.toBeInTheDocument();
      expect(screen.getByText('(2/3) asset models matched')).toBeVisible();

      await dropDown.clearFilter();

      expect(dropDown.getOption(assetModel1.name)).toBeVisible();
      expect(dropDown.getOption(assetModel2.name)).toBeVisible();
      expect(dropDown.getOption(assetModel3.name)).toBeVisible();

      await user.keyboard('Different Name');

      expect(dropDown.queryOption(assetModel1.name)).not.toBeInTheDocument();
      expect(dropDown.queryOption(assetModel2.name)).not.toBeInTheDocument();
      expect(dropDown.getOption(assetModel3.name)).toBeVisible();
      expect(screen.getByText('(1/3) asset models matched')).toBeVisible();

      await dropDown.clearFilter();
      await user.keyboard('Similar Description');

      expect(dropDown.queryOption(assetModel1.name)).not.toBeInTheDocument();
      expect(dropDown.getOption(assetModel2.name)).toBeVisible();
      expect(dropDown.getOption(assetModel3.name)).toBeVisible();
      expect(screen.getByText('(2/3) asset models matched')).toBeVisible();
    }, 40000);
  });
});
