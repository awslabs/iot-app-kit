import { AssetModelSelection } from './assetModelSelection/assetModelSelection';
import { AssetModelSelected } from './assetModelSelection/assetModelSelected';
import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import {
  type SelectedAssetModel,
  type UpdateSelectedAssetModel,
} from '../useSelectedAssetModel';
import {
  type SelectedAsset,
  type UpdateSelectedAsset,
} from '../useSelectedAsset';

type AssetModelExplorerOptions = {
  selectedAssetModel: SelectedAssetModel;
  setSelectedAssetModel: UpdateSelectedAssetModel;
  selectedAsset: SelectedAsset;
  setSelectedAsset: UpdateSelectedAsset;
  onResetSelectedAssetModel: () => void;
  iotSiteWiseClient: IoTSiteWise;
};

export const AssetModelExplorer = ({
  selectedAssetModel,
  setSelectedAssetModel,
  selectedAsset,
  setSelectedAsset,
  onResetSelectedAssetModel,
  iotSiteWiseClient,
}: AssetModelExplorerOptions) => {
  return selectedAssetModel.length > 0 ? (
    <AssetModelSelected
      iotSiteWiseClient={iotSiteWiseClient}
      selectedAssetModel={selectedAssetModel}
      selectedAsset={selectedAsset}
      setSelectedAsset={setSelectedAsset}
      onResetSelectedAssetModel={onResetSelectedAssetModel}
    />
  ) : (
    <AssetModelSelection
      iotSiteWiseClient={iotSiteWiseClient}
      onSelectAssetModel={setSelectedAssetModel}
      selectedAssetModel={selectedAssetModel}
      selectedAsset={selectedAsset}
      setSelectedAsset={setSelectedAsset}
    />
  );
};
