import type { ListAssets } from '@iot-app-kit/core';
import { render, screen, waitFor } from '@testing-library/react';
import ue from '@testing-library/user-event';
import { useState } from 'react';
import { AssetExplorer } from '../../explorers';
import { resourceExplorerQueryClient } from '../../requests/resource-explorer-query-client';
import type { SelectionMode } from '../../types/common';
import type { AssetResource } from '../../types/resources';
import * as dropDown from '../helpers/drop-down';
import { createListAssetsPage } from '../helpers/responses';

function SelectableAssetDropDown({
  selectionMode,
  listAssets,
}: {
  selectionMode?: SelectionMode;
  listAssets: ListAssets;
}) {
  const [selectedAssets, setSelectedAssets] = useState<AssetResource[]>([]);

  return (
    <AssetExplorer
      variant='drop-down'
      iotSiteWiseClient={{ listAssets }}
      selectionMode={selectionMode}
      selectedAssets={selectedAssets}
      onSelectAsset={setSelectedAssets}
    />
  );
}

describe('asset drop-down', () => {
  beforeEach(() => {
    resourceExplorerQueryClient.clear();
  });

  describe('rendering', () => {
    it('renders a drop-down without configuration', async () => {
      render(<AssetExplorer variant='drop-down' />);

      expect(screen.getByText('Select asset')).toBeVisible();

      await dropDown.open();

      expect(screen.getByText('No assets.')).toBeVisible();
    });

    it('renders a multi-select drop-down without configuration', async () => {
      render(<AssetExplorer variant='drop-down' selectionMode='multi' />);

      expect(screen.getByText('Select assets')).toBeVisible();

      await dropDown.open();

      expect(screen.getByText('No assets.')).toBeVisible();
    });

    it('renders drop-down options', async () => {
      const listAssetsResponse = createListAssetsPage(3);
      const {
        assetSummaries: [asset1, asset2, asset3],
      } = listAssetsResponse;
      const listAssets = vi.fn().mockResolvedValue(listAssetsResponse);
      render(
        <AssetExplorer variant='drop-down' iotSiteWiseClient={{ listAssets }} />
      );

      expect(dropDown.queryOption(asset1)).not.toBeInTheDocument();
      expect(dropDown.queryOption(asset2)).not.toBeInTheDocument();
      expect(dropDown.queryOption(asset3)).not.toBeInTheDocument();

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      const assetOption1 = dropDown.getOption(asset1);
      const assetOption2 = dropDown.getOption(asset2);
      const assetOption3 = dropDown.getOption(asset3);

      expect(assetOption1).toBeVisible();
      expect(assetOption1).toHaveTextContent(asset1.name);
      expect(assetOption1).toHaveTextContent(asset1.description);
      expect(assetOption2).toBeVisible();
      expect(assetOption2).toHaveTextContent(asset2.name);
      expect(assetOption2).toHaveTextContent(asset2.description);
      expect(assetOption3).toBeVisible();
      expect(assetOption3).toHaveTextContent(asset3.name);
      expect(assetOption3).toHaveTextContent(asset3.description);
    });
  });

  describe('request handling', () => {
    it('requests a single page of assets correctly', async () => {
      const listAssets = vi.fn().mockResolvedValue(createListAssetsPage(3));
      render(
        <AssetExplorer variant='drop-down' iotSiteWiseClient={{ listAssets }} />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      expect(listAssets).toHaveBeenCalledOnce();
    });

    it('requests multiple pages of assets correctly', async () => {
      const listAssets = vi
        .fn()
        .mockResolvedValueOnce(createListAssetsPage(1, 0, 'next-token-1'))
        .mockResolvedValueOnce(createListAssetsPage(1, 10, 'next-token-2'))
        .mockResolvedValueOnce(createListAssetsPage(1, 20));
      render(
        <AssetExplorer variant='drop-down' iotSiteWiseClient={{ listAssets }} />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      // The rest of the pages are requested after opening the drop-down
      expect(listAssets).toHaveBeenCalledTimes(3);
    });

    it('requests multiple lists of pages of assets correctly', async () => {
      const listAssets = vi
        .fn()
        .mockResolvedValueOnce(createListAssetsPage(1, 0, 'next-token-1'))
        .mockResolvedValueOnce(createListAssetsPage(1, 10))
        .mockResolvedValueOnce(createListAssetsPage(1, 20, 'next-token-2'))
        .mockResolvedValueOnce(createListAssetsPage(1, 30));

      render(
        <AssetExplorer
          variant='drop-down'
          iotSiteWiseClient={{ listAssets }}
          parameters={[
            { assetModelId: 'asset-model-id-1' },
            { assetModelId: 'asset-model-id-2' },
          ]}
        />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      await waitFor(() => expect(listAssets).toHaveBeenCalledTimes(4));
    });

    it('renders description of table', async () => {
      const { getByText } = render(
        <AssetExplorer description='This is a test asset explorer' />
      );
      expect(getByText('This is a test asset explorer')).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('does not allow selecting assets if selectionMode is undefined', async () => {
      const listAssetsResponse = createListAssetsPage(3);
      const {
        assetSummaries: [asset1, asset2, asset3],
      } = listAssetsResponse;
      const listAssets = vi.fn().mockResolvedValue(listAssetsResponse);
      const user = ue.setup();
      render(<SelectableAssetDropDown listAssets={listAssets} />);

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();
      await user.click(dropDown.getOption(asset1));

      expect(screen.queryByText(asset1.name)).not.toBeInTheDocument();
      expect(dropDown.queryOption(asset1)).not.toBeInTheDocument();
      expect(dropDown.queryOption(asset2)).not.toBeInTheDocument();
      expect(dropDown.queryOption(asset3)).not.toBeInTheDocument();
    });

    describe('single-select', () => {
      it('allows selecting a single asset', async () => {
        const listAssetsResponse = createListAssetsPage(3);
        const {
          assetSummaries: [asset1, asset2, asset3],
        } = listAssetsResponse;
        const listAssets = vi.fn().mockResolvedValue(listAssetsResponse);
        const user = ue.setup();
        render(
          <SelectableAssetDropDown
            selectionMode='single'
            listAssets={listAssets}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(asset1));

        expect(screen.getByText(asset1.name)).toBeVisible();
        expect(dropDown.queryOption(asset1)).not.toBeInTheDocument();
        expect(dropDown.queryOption(asset2)).not.toBeInTheDocument();
        expect(dropDown.queryOption(asset3)).not.toBeInTheDocument();
      });

      it('replaces the selection when a new selection is made', async () => {
        const listAssetsResponse = createListAssetsPage(3);
        const {
          assetSummaries: [asset1, asset2],
        } = listAssetsResponse;
        const listAssets = vi.fn().mockResolvedValue(listAssetsResponse);
        const user = ue.setup();
        render(
          <SelectableAssetDropDown
            selectionMode='single'
            listAssets={listAssets}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(asset1));

        expect(screen.getByText(asset1.name)).toBeVisible();

        await user.click(screen.getByText(asset1.name));
        await user.click(dropDown.getOption(asset2));

        expect(screen.getByText(asset2.name)).toBeVisible();
        expect(screen.queryByText(asset1.name)).not.toBeInTheDocument();
      });
    });

    describe('multi-select', () => {
      it('allows selecting multiple assets', async () => {
        const listAssetsResponse = createListAssetsPage(3);
        const {
          assetSummaries: [asset1, asset2, asset3],
        } = listAssetsResponse;
        const listAssets = vi.fn().mockResolvedValue(listAssetsResponse);
        const user = ue.setup();
        render(
          <SelectableAssetDropDown
            selectionMode='multi'
            listAssets={listAssets}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(asset1));
        await user.click(dropDown.getOption(asset2));
        await dropDown.close();

        expect(screen.getByText(asset1.name)).toBeVisible();
        expect(screen.getByText(asset1.description)).toBeVisible();
        expect(screen.getByText(asset2.name)).toBeVisible();
        expect(screen.getByText(asset2.description)).toBeVisible();
        expect(dropDown.queryOption(asset1)).not.toBeInTheDocument();
        expect(dropDown.queryOption(asset2)).not.toBeInTheDocument();
        expect(dropDown.queryOption(asset3)).not.toBeInTheDocument();
      });

      it('allows for de-selecting assets', async () => {
        const listAssetsResponse = createListAssetsPage(2);
        const {
          assetSummaries: [asset1, asset2],
        } = listAssetsResponse;
        const listAssets = vi.fn().mockResolvedValue(listAssetsResponse);
        const user = ue.setup();
        render(
          <SelectableAssetDropDown
            selectionMode='multi'
            listAssets={listAssets}
          />
        );

        await dropDown.open();
        await dropDown.waitForLoadingToFinish();
        await user.click(dropDown.getOption(asset1));
        await user.click(dropDown.getOption(asset2));
        await dropDown.close();

        expect(screen.getByText(asset1.name)).toBeVisible();
        expect(screen.getByText(asset1.description)).toBeVisible();
        expect(screen.getByText(asset2.name)).toBeVisible();
        expect(screen.getByText(asset2.description)).toBeVisible();

        await user.click(
          screen.getByRole('button', { name: `Remove ${asset2.name}` })
        );

        expect(screen.getByText(asset1.name)).toBeVisible();
        expect(screen.getByText(asset1.description)).toBeVisible();
        expect(screen.queryByText(asset2.name)).not.toBeInTheDocument();
        expect(screen.queryByText(asset2.description)).not.toBeInTheDocument();

        await user.click(
          screen.getByRole('button', { name: `Remove ${asset1.name}` })
        );

        expect(screen.queryByText(asset1.name)).not.toBeInTheDocument();
        expect(screen.queryByText(asset1.description)).not.toBeInTheDocument();
      });
    });
  });

  describe('filtering', () => {
    it('filters assets', async () => {
      const asset1 = {
        name: 'Similar Name 1',
        description: 'Different Description 1',
      };
      const asset2 = {
        name: 'Similar Name 2',
        description: 'Similar Description 2',
      };
      const asset3 = {
        name: 'Different Name 3',
        description: 'Similar Description 3',
      };
      const listAssets = vi.fn().mockResolvedValue({
        assetSummaries: [asset1, asset2, asset3],
      });
      const user = ue.setup();
      render(
        <AssetExplorer
          variant='drop-down'
          iotSiteWiseClient={{ listAssets }}
          dropDownSettings={{
            isFilterEnabled: true,
          }}
        />
      );

      await dropDown.open();
      await dropDown.waitForLoadingToFinish();

      expect(screen.getByPlaceholderText('Filter assets')).toBeVisible();

      expect(dropDown.getOption(asset1)).toBeVisible();
      expect(dropDown.getOption(asset2)).toBeVisible();
      expect(dropDown.getOption(asset3)).toBeVisible();

      await user.keyboard('Similar Name');

      expect(dropDown.getOption(asset1)).toBeVisible();
      expect(dropDown.getOption(asset2)).toBeVisible();
      expect(dropDown.queryOption(asset3)).not.toBeInTheDocument();
      expect(screen.getByText('(2/3) assets matched')).toBeVisible();

      await dropDown.clearFilter();

      expect(dropDown.getOption(asset1)).toBeVisible();
      expect(dropDown.getOption(asset2)).toBeVisible();
      expect(dropDown.getOption(asset3)).toBeVisible();

      await user.keyboard('Different Name');

      expect(dropDown.queryOption(asset1)).not.toBeInTheDocument();
      expect(dropDown.queryOption(asset2)).not.toBeInTheDocument();
      expect(dropDown.getOption(asset3)).toBeVisible();
      expect(screen.getByText('(1/3) assets matched')).toBeVisible();

      await dropDown.clearFilter();
      await user.keyboard('Similar Description');

      expect(dropDown.queryOption(asset1)).not.toBeInTheDocument();
      expect(dropDown.getOption(asset2)).toBeVisible();
      expect(dropDown.getOption(asset3)).toBeVisible();
      expect(screen.getByText('(2/3) assets matched')).toBeVisible();
    });
  });
});
