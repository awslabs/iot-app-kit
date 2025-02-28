import { useCallback } from 'react';

import { ResourceRelationshipPath } from './resource-relationship-path';
import { useAncestorAssets } from './use-ancestor-assets';
import type { ParentAsset, ResourcePathItem } from './types';
import type { ListAssociatedAssets } from '@iot-app-kit/core';
import type { AssetResource } from '../../../types/resources';

export interface AssetHierarchyPathProps {
  parentAsset?: ParentAsset;
  onClickPathAsset: (asset?: AssetResource) => void;
  listAssociatedAssets: ListAssociatedAssets;
}

export function AssetHierarchyPath({
  parentAsset,
  onClickPathAsset,
  listAssociatedAssets,
}: AssetHierarchyPathProps) {
  const { ancestorAssets, isLoading } = useAncestorAssets({
    parentAsset,
    listAssociatedAssets,
  });

  const handleClickPathAsset = useCallback(
    ({ id: assetId }: ResourcePathItem) => {
      const asset = ancestorAssets.find((asset) => {
        if (asset.assetId === assetId) {
          return asset;
        }
      });

      onClickPathAsset(asset);
    },
    [ancestorAssets, onClickPathAsset]
  );

  const assetHierarchyPath = createAssetHierarchyPath({
    parentAsset,
    ancestorAssets,
    isLoading,
  });

  return (
    <ResourceRelationshipPath
      resourcePath={assetHierarchyPath}
      onClickResourcePathItem={handleClickPathAsset}
    />
  );
}

function createAssetHierarchyPath({
  parentAsset,
  ancestorAssets,
  isLoading,
}: {
  parentAsset?: ParentAsset;
  ancestorAssets: AssetResource[];
  isLoading: boolean;
}): ResourcePathItem[] {
  const rootPath = [{ id: '', name: 'Root' }];
  const ancestorAssetsPath = ancestorAssets.map(({ assetId: id, name }) => ({
    id,
    name,
  }));
  const loadingPath = isLoading ? [{ id: '', name: 'Loading...' }] : [];
  const parentPath =
    !isLoading && isParentAsset(parentAsset)
      ? [{ id: parentAsset.assetId, name: parentAsset.name }]
      : [];

  const assetHierarchyPath: ResourcePathItem[] = [
    ...rootPath,
    ...ancestorAssetsPath,
    ...parentPath,
    ...loadingPath,
  ];

  return assetHierarchyPath;
}

function isParentAsset(parentAsset?: ParentAsset): parentAsset is ParentAsset {
  return Boolean(parentAsset);
}
