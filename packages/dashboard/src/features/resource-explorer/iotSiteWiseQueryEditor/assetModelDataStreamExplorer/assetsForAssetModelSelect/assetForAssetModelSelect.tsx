import React from 'react';

import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { SelectedAsset, UpdateSelectedAsset } from '../useSelectedAsset';
import { AssetExplorer, AssetResource } from '@iot-app-kit/react-components';
import { SelectedAssetModel } from '../useSelectedAssetModel';

/*
AssetForAssetModelSelect renders the Asset Explorer for when an Asset Model has
already been selected in the Dynamic Assets tab. This drop down changes the asset
of the query on any chart that has a asset model query.
*/

export type AssetForAssetModelSelectOptions = {
  selectedAsset: SelectedAsset;
  selectedAssetModel: SelectedAssetModel;
  onSelectAsset: UpdateSelectedAsset;
  iotSiteWiseClient: IoTSiteWise;
};

export const AssetForAssetModelSelect = ({
  iotSiteWiseClient,
  selectedAsset,
  selectedAssetModel,
  onSelectAsset,
}: AssetForAssetModelSelectOptions) => {
  return (
    <AssetExplorer
      iotSiteWiseClient={iotSiteWiseClient}
      parameters={selectedAssetModel}
      variant='drop-down'
      onSelectAsset={onSelectAsset}
      selectedAssets={selectedAsset}
      selectionMode='single'
      tableSettings={{
        isFilterEnabled: true,
        isUserSettingsEnabled: true,
      }}
      description='Browse through your asset hierarchy and select an asset to view its associated data streams.'
      ariaLabels={{
        resizerRoleDescription: 'Resize button',
        itemSelectionLabel: (isNotSelected, asset: AssetResource) =>
          isNotSelected
            ? `Select asset ${asset.name}`
            : `Deselect asset ${asset.name}`,
      }}
    />
  );
};
