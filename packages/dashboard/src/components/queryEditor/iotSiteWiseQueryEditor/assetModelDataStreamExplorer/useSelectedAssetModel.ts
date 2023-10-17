import { AssetModelSummary } from '@aws-sdk/client-iotsitewise';
import { useState } from 'react';

export const useSelectedAssetModel = (initialSelectedAssetModel?: AssetModelSummary) => {
  const [selectedAssetModel, setSelectedAssetModel] = useState<AssetModelSummary | undefined>(
    initialSelectedAssetModel
  );

  return [selectedAssetModel, setSelectedAssetModel] as const;
};

export type SelectedAssetModel = ReturnType<typeof useSelectedAssetModel>[0];
export type UpdateSelectedAssetModel = ReturnType<typeof useSelectedAssetModel>[1];

export const createInitialAssetModelSummary = (id?: string) => (id ? ({ id } as AssetModelSummary) : undefined);
