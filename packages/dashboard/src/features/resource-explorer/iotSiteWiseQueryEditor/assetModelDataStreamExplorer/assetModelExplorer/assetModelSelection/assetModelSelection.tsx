import React from 'react';

import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { HorizontalDivider } from '~/atoms/divider/horizontalDivider';
import { AssetForAssetModelSelectForm } from '../../assetsForAssetModelSelect/assetForAssetModelSelectForm';
import {
  SelectedAsset,
  UpdateSelectedAsset,
  useSelectedAsset,
} from '../../useSelectedAsset';
import {
  SelectedAssetModel,
  UpdateSelectedAssetModel,
  useSelectedAssetModel,
} from '../../useSelectedAssetModel';
import { AssetModelSave } from './assetModelSave';
import { AssetModelSelect } from './assetModelSelect';

type AssetModelSelectionOptions = {
  selectedAssetModel: SelectedAssetModel;
  onSelectAssetModel: UpdateSelectedAssetModel;
  selectedAsset: SelectedAsset;
  setSelectedAsset: UpdateSelectedAsset;
  iotSiteWiseClient: IoTSiteWise;
};

export const AssetModelSelection = ({
  selectedAssetModel,
  onSelectAssetModel,
  selectedAsset,
  setSelectedAsset,
  iotSiteWiseClient,
}: AssetModelSelectionOptions) => {
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
        Dynamic asset visualizations allow you to build one visualization to
        represent any asset of a specified asset model.{' '}
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
      <AssetModelSave disabled={!currentSelectedAssetModel} onSave={onSave} />
    </SpaceBetween>
  );
};
