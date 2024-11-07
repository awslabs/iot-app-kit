import {
  type AssetExplorerProps,
  type AssetResource,
} from '@iot-app-kit/react-components';
import { useState } from 'react';

export const useSelectedAsset = (
  initialSelectedAsset: NonNullable<AssetExplorerProps['selectedAssets']>
) => {
  const [selectedAsset, setSelectedAsset] =
    useState<NonNullable<AssetExplorerProps['selectedAssets']>>(
      initialSelectedAsset
    );

  return [selectedAsset, setSelectedAsset] as const;
};

export type SelectedAsset = ReturnType<typeof useSelectedAsset>[0];
export type UpdateSelectedAsset = ReturnType<typeof useSelectedAsset>[1];

export const createInitialAssetResource = (assetId?: string) =>
  assetId ? [{ assetId } as AssetResource] : [];
