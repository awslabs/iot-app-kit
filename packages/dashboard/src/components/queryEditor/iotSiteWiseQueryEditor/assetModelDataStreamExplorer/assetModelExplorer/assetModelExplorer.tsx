import React from 'react';

import { AssetModelSelection } from './assetModelSelection/assetModelSelection';
import { AssetModelSelected } from './assetModelSelection/assetModelSelected';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { SelectedAssetModel, UpdateSelectedAssetModel } from '../useSelectedAssetModel';
import { SelectedAsset, UpdateSelectedAsset } from '../useSelectedAsset';

type AssetModelExplorerOptions = {
  selectedAssetModel?: SelectedAssetModel;
  setSelectedAssetModel: UpdateSelectedAssetModel;
  selectedAsset?: SelectedAsset;
  setSelectedAsset: UpdateSelectedAsset;
  onResetSelectedAssetModel: () => void;
  client: IoTSiteWiseClient;
};

export const AssetModelExplorer = ({
  selectedAssetModel,
  setSelectedAssetModel,
  selectedAsset,
  setSelectedAsset,
  onResetSelectedAssetModel,
  client,
}: AssetModelExplorerOptions) => {
  return selectedAssetModel ? (
    <AssetModelSelected
      client={client}
      selectedAssetModel={selectedAssetModel}
      selectedAsset={selectedAsset}
      setSelectedAsset={setSelectedAsset}
      onResetSelectedAssetModel={onResetSelectedAssetModel}
    />
  ) : (
    <AssetModelSelection
      client={client}
      onSelectAssetModel={setSelectedAssetModel}
      selectedAssetModel={selectedAssetModel}
      selectedAsset={selectedAsset}
      setSelectedAsset={setSelectedAsset}
    />
  );
};
