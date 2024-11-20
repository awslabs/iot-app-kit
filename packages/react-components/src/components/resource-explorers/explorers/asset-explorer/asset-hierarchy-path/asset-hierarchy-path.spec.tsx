import { type AssetSummary } from '@aws-sdk/client-iotsitewise';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import ue from '@testing-library/user-event';

import { resourceExplorerQueryClient } from '../../../requests/resource-explorer-query-client';

import { type ListAssociatedAssets } from '@iot-app-kit/core';
import {
  AssetHierarchyPath,
  type AssetHierarchyPathProps,
} from './asset-hierarchy-path';
import {
  PARENT_TRAVERSAL_DIRECTION,
  SINGLE_PARENT_MAX_RESULTS,
} from './constants';

const parentAsset = {
  assetId: 'parent-asset',
  name: 'Parent Asset',
} satisfies AssetHierarchyPathProps['parentAsset'];
const grandParentAsset = {
  assetId: 'grand-parent-asset',
  name: 'Grand Parent Asset',
} satisfies AssetHierarchyPathProps['parentAsset'];
const greatGrandParentAsset = {
  assetId: 'great-grand-parent-asset',
  name: 'Great Grand Parent Asset',
} satisfies AssetHierarchyPathProps['parentAsset'];
const grandParentAssetSummary = {
  id: grandParentAsset.assetId,
  name: grandParentAsset.name,
} as const satisfies Partial<AssetSummary> as AssetSummary;
const greatGrandParentAssetSummary = {
  id: greatGrandParentAsset.assetId,
  name: greatGrandParentAsset.name,
} as const satisfies Partial<AssetSummary> as AssetSummary;

const grandParentListAssociatedAssetsResponse = {
  assetSummaries: [grandParentAssetSummary],
} satisfies Awaited<ReturnType<ListAssociatedAssets>>;
const greatGrandParentListAssociatedAssetsResponse = {
  assetSummaries: [greatGrandParentAssetSummary],
} satisfies Awaited<ReturnType<ListAssociatedAssets>>;
const finalListAssociatedAssetsResponse = {
  assetSummaries: [],
} satisfies Awaited<ReturnType<ListAssociatedAssets>>;

describe(AssetHierarchyPath, () => {
  const onClickPathAsset = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    resourceExplorerQueryClient.clear();
  });

  describe('requests', () => {
    it('calls ListAssociatedAssets correctly with two levels of assets', () => {
      const listAssociatedAssets = vi
        .fn()
        .mockResolvedValue(finalListAssociatedAssetsResponse);
      render(
        <AssetHierarchyPath
          parentAsset={parentAsset}
          onClickPathAsset={onClickPathAsset}
          listAssociatedAssets={listAssociatedAssets}
        />
      );

      expect(listAssociatedAssets).toHaveBeenCalledOnceWith({
        assetId: parentAsset.assetId,
        traversalDirection: PARENT_TRAVERSAL_DIRECTION,
        maxResults: SINGLE_PARENT_MAX_RESULTS,
      });
    });

    it('calls ListAssociatedAssets correctly with three levels of assets', async () => {
      const listAssociatedAssets = vi
        .fn()
        .mockResolvedValueOnce(grandParentListAssociatedAssetsResponse)
        .mockResolvedValue(finalListAssociatedAssetsResponse);
      render(
        <AssetHierarchyPath
          parentAsset={parentAsset}
          onClickPathAsset={onClickPathAsset}
          listAssociatedAssets={listAssociatedAssets}
        />
      );

      // There is no need to wait for parent asset to load.
      expect(listAssociatedAssets).toHaveBeenCalledOnceWith({
        assetId: parentAsset.assetId,
        traversalDirection: PARENT_TRAVERSAL_DIRECTION,
        maxResults: SINGLE_PARENT_MAX_RESULTS,
      });

      await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
      expect(listAssociatedAssets).toHaveBeenCalledTimes(2);
      expect(listAssociatedAssets).toHaveBeenNthCalledWith(2, {
        assetId: grandParentAsset.assetId,
        traversalDirection: PARENT_TRAVERSAL_DIRECTION,
        maxResults: SINGLE_PARENT_MAX_RESULTS,
      });
    });

    it('calls ListAssociatedAssets correctly with four levels of assets', async () => {
      const listAssociatedAssets = vi
        .fn()
        .mockResolvedValueOnce(grandParentListAssociatedAssetsResponse)
        .mockResolvedValueOnce(greatGrandParentListAssociatedAssetsResponse)
        .mockResolvedValue(finalListAssociatedAssetsResponse);
      render(
        <AssetHierarchyPath
          parentAsset={parentAsset}
          onClickPathAsset={onClickPathAsset}
          listAssociatedAssets={listAssociatedAssets}
        />
      );

      // There is no need to wait for parent asset to load
      expect(listAssociatedAssets).toHaveBeenCalledOnceWith({
        assetId: parentAsset.assetId,
        traversalDirection: PARENT_TRAVERSAL_DIRECTION,
        maxResults: SINGLE_PARENT_MAX_RESULTS,
      });

      // The rest of the ancestor assets finish loading together.
      await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
      expect(listAssociatedAssets).toHaveBeenCalledTimes(3);
      expect(listAssociatedAssets).toHaveBeenNthCalledWith(2, {
        assetId: grandParentAsset.assetId,
        traversalDirection: PARENT_TRAVERSAL_DIRECTION,
        maxResults: SINGLE_PARENT_MAX_RESULTS,
      });
      expect(listAssociatedAssets).toHaveBeenNthCalledWith(3, {
        assetId: greatGrandParentAsset.assetId,
        traversalDirection: PARENT_TRAVERSAL_DIRECTION,
        maxResults: SINGLE_PARENT_MAX_RESULTS,
      });
    });
  });

  describe('rendering', () => {
    it('renders an asset hierarchy path with one level of assets', async () => {
      const listAssociatedAssets = vi
        .fn()
        .mockResolvedValue(finalListAssociatedAssetsResponse);
      render(
        <AssetHierarchyPath
          onClickPathAsset={onClickPathAsset}
          listAssociatedAssets={listAssociatedAssets}
        />
      );

      expect(screen.getByText('Root')).toBeVisible();
    });

    it('renders a hierarchy path with two levels', async () => {
      const listAssociatedAssets = vi
        .fn()
        .mockResolvedValue(finalListAssociatedAssetsResponse);
      render(
        <AssetHierarchyPath
          parentAsset={parentAsset}
          onClickPathAsset={onClickPathAsset}
          listAssociatedAssets={listAssociatedAssets}
        />
      );

      expect(screen.getByText('Root')).toBeVisible();

      await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
      expect(screen.getByText(parentAsset.name)).toBeVisible();
    });

    it('renders a hierarchy path with three levels', async () => {
      const listAssociatedAssets = vi
        .fn()
        .mockResolvedValueOnce(grandParentListAssociatedAssetsResponse)
        .mockResolvedValue(finalListAssociatedAssetsResponse);
      render(
        <AssetHierarchyPath
          parentAsset={parentAsset}
          onClickPathAsset={onClickPathAsset}
          listAssociatedAssets={listAssociatedAssets}
        />
      );

      expect(screen.getByText('Root')).toBeVisible();

      await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
      expect(screen.getByText(grandParentAsset.name)).toBeVisible();
      expect(screen.getByText(parentAsset.name)).toBeVisible();
    });

    it('renders a hierarchy path with four levels', async () => {
      const listAssociatedAssets = vi
        .fn()
        .mockResolvedValueOnce(grandParentListAssociatedAssetsResponse)
        .mockResolvedValueOnce(greatGrandParentListAssociatedAssetsResponse)
        .mockResolvedValue(finalListAssociatedAssetsResponse);
      render(
        <AssetHierarchyPath
          parentAsset={parentAsset}
          onClickPathAsset={onClickPathAsset}
          listAssociatedAssets={listAssociatedAssets}
        />
      );

      expect(screen.getByText('Root')).toBeVisible();

      await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
      expect(screen.getByText(greatGrandParentAsset.name)).toBeVisible();
      expect(screen.getByText(grandParentAsset.name)).toBeVisible();
      expect(screen.getByText(parentAsset.name)).toBeVisible();
    });
  });

  describe('navigation', () => {
    it('does not provide navigation with one level of assets', async () => {
      const listAssociatedAssets = vi
        .fn()
        .mockResolvedValue(finalListAssociatedAssetsResponse);
      const user = ue.setup();
      render(
        <AssetHierarchyPath
          onClickPathAsset={onClickPathAsset}
          listAssociatedAssets={listAssociatedAssets}
        />
      );

      await user.click(screen.getByText('Root'));
      expect(onClickPathAsset).not.toHaveBeenCalled();
    });

    it('provides navigation to the root with two or more levels of assets', async () => {
      const listAssociatedAssets = vi
        .fn()
        .mockResolvedValue(finalListAssociatedAssetsResponse);
      const user = ue.setup();
      render(
        <AssetHierarchyPath
          parentAsset={parentAsset}
          onClickPathAsset={onClickPathAsset}
          listAssociatedAssets={listAssociatedAssets}
        />
      );

      await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

      await user.click(screen.getByText('Root'));
      expect(onClickPathAsset).toHaveBeenCalledOnceWith(undefined);
    });

    it('does not provide navigation to the parent asset with any level of assets', async () => {
      const listAssociatedAssets = vi
        .fn()
        .mockResolvedValue(finalListAssociatedAssetsResponse);
      const user = ue.setup();
      render(
        <AssetHierarchyPath
          parentAsset={parentAsset}
          onClickPathAsset={onClickPathAsset}
          listAssociatedAssets={listAssociatedAssets}
        />
      );

      await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

      await user.click(screen.getByText(parentAsset.name));
      expect(onClickPathAsset).not.toHaveBeenCalled();
    });

    it('provides navigation to ancestor assets with three or more levels of assets', async () => {
      const listAssociatedAssets = vi
        .fn()
        .mockResolvedValueOnce(grandParentListAssociatedAssetsResponse)
        .mockResolvedValue(finalListAssociatedAssetsResponse);
      const user = ue.setup();
      render(
        <AssetHierarchyPath
          parentAsset={parentAsset}
          onClickPathAsset={onClickPathAsset}
          listAssociatedAssets={listAssociatedAssets}
        />
      );

      await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

      await user.click(screen.getByText(grandParentAsset.name));
      expect(onClickPathAsset).toHaveBeenCalledOnceWith(
        expect.objectContaining(grandParentAsset)
      );
    });
  });
});
