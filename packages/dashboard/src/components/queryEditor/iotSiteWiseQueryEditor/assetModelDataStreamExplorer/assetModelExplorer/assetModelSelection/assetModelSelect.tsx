import React from 'react';

import FormField from '@cloudscape-design/components/form-field';
import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import {
  SelectedAssetModel,
  UpdateSelectedAssetModel,
} from '../../useSelectedAssetModel';
import { AssetModelExplorer } from '@iot-app-kit/react-components';

type AssetModelSelectOptions = {
  selectedAssetModel?: SelectedAssetModel;
  onSelectAssetModel: UpdateSelectedAssetModel;
  client: IoTSiteWise;
};

export const AssetModelSelect = ({
  client,
  selectedAssetModel,
  onSelectAssetModel,
}: AssetModelSelectOptions) => {
  return (
    <FormField
      label='Asset model'
      description='Select an asset model to add the associated properties into your dynamic display.'
    >
      <AssetModelExplorer
        requestFns={client}
        onSelectAssetModel={onSelectAssetModel}
        selectedAssetModels={selectedAssetModel}
        selectionMode='single'
        variant='drop-down'
        dropDownSettings={{
          isFilterEnabled: true,
        }}
      />
    </FormField>
  );
};
