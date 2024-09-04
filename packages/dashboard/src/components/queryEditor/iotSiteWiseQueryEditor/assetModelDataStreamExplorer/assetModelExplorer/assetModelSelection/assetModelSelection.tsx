import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';

import { AssetModelSelect } from './assetModelSelect';
import { HorizontalDivider } from '~/components/divider/horizontalDivider';
import { AssetModelSave } from './assetModelSave';
import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import {
  SelectedAssetModel,
  UpdateSelectedAssetModel,
  useSelectedAssetModel,
} from '../../useSelectedAssetModel';
import {
  SelectedAsset,
  UpdateSelectedAsset,
  useSelectedAsset,
} from '../../useSelectedAsset';
import { AssetForAssetModelSelectForm } from '../../assetsForAssetModelSelect/assetForAssetModelSelectForm';

type AssetModelSelectionOptions = {
  selectedAssetModel: SelectedAssetModel;
  onSelectAssetModel: UpdateSelectedAssetModel;
  selectedAsset: SelectedAsset;
  setSelectedAsset: UpdateSelectedAsset;
  client: IoTSiteWise;
};

export const AssetModelSelection = ({
  selectedAssetModel,
  onSelectAssetModel,
  selectedAsset,
  setSelectedAsset,
  client,
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
        client={client}
      />
      <AssetForAssetModelSelectForm
        selectedAsset={currentSelectedAsset}
        onSelectAsset={selectCurrentAsset}
        selectedAssetModel={currentSelectedAssetModel}
        client={client}
      />
      <HorizontalDivider />
      <AssetModelSave disabled={!currentSelectedAssetModel} onSave={onSave} />
    </SpaceBetween>
  );
};
