import FormField from '@cloudscape-design/components/form-field';
import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import {
  type SelectedAssetModel,
  type UpdateSelectedAssetModel,
} from '../../useSelectedAssetModel';
import { AssetModelExplorer } from '@iot-app-kit/react-components';

export interface AssetModelSelectProps {
  selectedAssetModel?: SelectedAssetModel;
  onSelectAssetModel: UpdateSelectedAssetModel;
  iotSiteWiseClient: IoTSiteWise;
}

export const AssetModelSelect = ({
  iotSiteWiseClient,
  selectedAssetModel,
  onSelectAssetModel,
}: AssetModelSelectProps) => {
  return (
    <FormField
      label='Asset model'
      description='Select an asset model, and add its associated properties.'
    >
      <AssetModelExplorer
        iotSiteWiseClient={iotSiteWiseClient}
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
