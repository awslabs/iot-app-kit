import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { AssetModelSelect } from './assetModelSelect';
import { HorizontalDivider } from '~/features/widget-customization/atoms/horizontal-divider';
import { AssetModelSaveButton } from './assetModelSaveButton';
import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import {
  type SelectedAssetModel,
  type UpdateSelectedAssetModel,
  useSelectedAssetModel,
} from '../../useSelectedAssetModel';
import {
  type SelectedAsset,
  type UpdateSelectedAsset,
  useSelectedAsset,
} from '../../useSelectedAsset';
import { AssetForAssetModelSelectForm } from '../../assetsForAssetModelSelect/assetForAssetModelSelectForm';

export interface AssetModelSelectionProps {
  selectedAssetModel: SelectedAssetModel;
  onSelectAssetModel: UpdateSelectedAssetModel;
  selectedAsset: SelectedAsset;
  setSelectedAsset: UpdateSelectedAsset;
  iotSiteWiseClient: IoTSiteWise;
}

export const AssetModelSelection = ({
  selectedAssetModel,
  onSelectAssetModel,
  selectedAsset,
  setSelectedAsset,
  iotSiteWiseClient,
}: AssetModelSelectionProps) => {
  const [currentSelectedAssetModel, selectCurrentAssetModel] =
    useSelectedAssetModel(selectedAssetModel);

  const [currentSelectedAsset, selectCurrentAsset] =
    useSelectedAsset(selectedAsset);

  const onSave = () => {
    onSelectAssetModel(currentSelectedAssetModel);
    setSelectedAsset(currentSelectedAsset);
  };

  return (
    <SpaceBetween size='s' direction='vertical'>
      <Box variant='p'>
        Dynamic asset visualizations allow you to build a visualization to
        represent an asset of a specified asset model.{' '}
        <Link
          external
          href='https://docs.aws.amazon.com/iot-sitewise/latest/userguide/industrial-asset-models.html'
        >
          Learn more
        </Link>
      </Box>
      <AssetModelSelect
        selectedAssetModel={currentSelectedAssetModel}
        onSelectAssetModel={selectCurrentAssetModel}
        iotSiteWiseClient={iotSiteWiseClient}
      />
      <AssetForAssetModelSelectForm
        selectedAsset={currentSelectedAsset}
        onSelectAsset={selectCurrentAsset}
        selectedAssetModel={currentSelectedAssetModel}
        iotSiteWiseClient={iotSiteWiseClient}
      />
      <HorizontalDivider />
      <AssetModelSaveButton
        disabled={!currentSelectedAssetModel}
        onSave={onSave}
      />
    </SpaceBetween>
  );
};
