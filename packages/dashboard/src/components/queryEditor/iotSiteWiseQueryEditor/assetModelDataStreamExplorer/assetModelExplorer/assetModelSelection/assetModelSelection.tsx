import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';

import { AssetModelSelectionNotice } from './assetModelSelectionNotice';
import { AssetModelSelect } from './assetModelSelect';
import { HorizontalDivider } from '~/components/divider/horizontalDivider';
import { AssetModelSave } from './assetModelSave';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { SelectedAssetModel, UpdateSelectedAssetModel, useSelectedAssetModel } from '../../useSelectedAssetModel';
import { SelectedAsset, UpdateSelectedAsset, useSelectedAsset } from '../../useSelectedAsset';
import { AssetForAssetModelSelectForm } from '../../assetsForAssetModelSelect/assetForAssetModelSelectForm';

type AssetModelSelectionOptions = {
  selectedAssetModel?: SelectedAssetModel;
  onSelectAssetModel: UpdateSelectedAssetModel;
  selectedAsset?: SelectedAsset;
  setSelectedAsset: UpdateSelectedAsset;
  client: IoTSiteWiseClient;
};

export const AssetModelSelection = ({
  selectedAssetModel,
  onSelectAssetModel,
  selectedAsset,
  setSelectedAsset,
  client,
}: AssetModelSelectionOptions) => {
  const [currentSelectedAssetModel, selectCurrentAssetModel] = useSelectedAssetModel(selectedAssetModel);
  const [currentSelectedAsset, selectCurrentAsset] = useSelectedAsset(selectedAsset);

  const onSave = () => {
    onSelectAssetModel(currentSelectedAssetModel);
    setSelectedAsset(currentSelectedAsset);
  };

  return (
    <SpaceBetween size='s' direction='vertical'>
      <AssetModelSelectionNotice />
      <AssetModelSelect
        selectedAssetModel={currentSelectedAssetModel}
        onSelectAssetModel={selectCurrentAssetModel}
        client={client}
      />
      <AssetForAssetModelSelectForm
        assetModelId={currentSelectedAssetModel?.id}
        selectedAsset={currentSelectedAsset}
        onSelectAsset={selectCurrentAsset}
        client={client}
      />
      <HorizontalDivider />
      <AssetModelSave onSave={onSave} />
    </SpaceBetween>
  );
};
