import { AssetSummary } from '@aws-sdk/client-iotsitewise';
import { useState } from 'react';

export const useSelectedAsset = (initialSelectedAsset?: AssetSummary) => {
  const [selectedAsset, setSelectedAsset] = useState<AssetSummary | undefined>(initialSelectedAsset);

  return [selectedAsset, setSelectedAsset] as const;
};

export type SelectedAsset = ReturnType<typeof useSelectedAsset>[0];
export type UpdateSelectedAsset = ReturnType<typeof useSelectedAsset>[1];

export const createInitialAsset = (assetId?: string) => (assetId ? ({ id: assetId } as AssetSummary) : undefined);
