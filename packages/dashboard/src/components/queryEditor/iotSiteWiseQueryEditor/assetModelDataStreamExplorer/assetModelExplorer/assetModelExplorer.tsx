import { AssetModelSelection } from './assetModelSelection/assetModelSelection';
import { AssetModelSelected } from './assetModelSelection/assetModelSelected';
import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import type {
  SelectedAssetModel,
  UpdateSelectedAssetModel,
} from '../useSelectedAssetModel';
import type { SelectedAsset, UpdateSelectedAsset } from '../useSelectedAsset';

export interface AssetModelExplorerProps {
  selectedAssetModel: SelectedAssetModel;
  setSelectedAssetModel: UpdateSelectedAssetModel;
  selectedAsset: SelectedAsset;
  setSelectedAsset: UpdateSelectedAsset;
  onResetSelectedAssetModel: VoidFunction;
  iotSiteWiseClient: IoTSiteWise;
}

export const AssetModelExplorer = ({
  selectedAssetModel,
  setSelectedAssetModel,
  selectedAsset,
  setSelectedAsset,
  onResetSelectedAssetModel,
  iotSiteWiseClient,
}: AssetModelExplorerProps) => {
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
