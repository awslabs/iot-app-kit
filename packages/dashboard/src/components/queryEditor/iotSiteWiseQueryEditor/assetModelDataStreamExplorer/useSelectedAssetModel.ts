import {
  AssetModelExplorerProps,
  AssetModelResource,
} from '@iot-app-kit/react-components';
import { useState } from 'react';

export const useSelectedAssetModel = (
  initialSelectedAssetModel: NonNullable<
    AssetModelExplorerProps['selectedAssetModels']
  >
) => {
  const [selectedAssetModel, setSelectedAssetModel] = useState<
    NonNullable<AssetModelExplorerProps['selectedAssetModels']>
  >(initialSelectedAssetModel);

  return [selectedAssetModel, setSelectedAssetModel] as const;
};

export type SelectedAssetModel = ReturnType<typeof useSelectedAssetModel>[0];
export type UpdateSelectedAssetModel = ReturnType<
  typeof useSelectedAssetModel
>[1];

export const createInitialAssetModelResource = (assetModelId?: string) =>
  assetModelId ? [{ assetModelId } as AssetModelResource] : [];
