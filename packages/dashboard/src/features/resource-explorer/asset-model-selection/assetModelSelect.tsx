import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import FormField from '@cloudscape-design/components/form-field';
import { type AssetResource } from '@iot-app-kit/react-components';
import React, { useEffect } from 'react';
import { AssetForAssetModelSelect } from '~/features/resource-explorer/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/assetsForAssetModelSelect/assetForAssetModelSelect';
import { useAssetsForAssetModel } from '~/features/resource-explorer/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/assetsForAssetModelSelect/useAssetsForAssetModel/useAssetsForAssetModel';
import {
  createInitialAssetResource,
  useSelectedAsset,
} from '~/features/resource-explorer/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/useSelectedAsset';
import {
  createInitialAssetModelResource,
  useSelectedAssetModel,
} from '~/features/resource-explorer/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/useSelectedAssetModel';

type AssetModelSelectOptions = {
  iotSiteWiseClient: IoTSiteWise;
  assetModelId: string;
  selectedAssetId?: string;
  hideTitle?: boolean;
  controlId?: string;
  updateSelectedAsset: (asset: AssetResource | undefined) => void;
};
export const AssetModelSelect = ({
  iotSiteWiseClient,
  hideTitle = false,
  selectedAssetId,
  assetModelId,
  updateSelectedAsset,
}: AssetModelSelectOptions) => {
  const [selectedAssetModel, _selectAssetModel] = useSelectedAssetModel(
    createInitialAssetModelResource(assetModelId)
  );

  const { assetSummaries } = useAssetsForAssetModel({
    assetModelId,
    iotSiteWiseClient,
    fetchAll: true,
  });

  const currentSelectedAsset = assetSummaries.find(
    ({ id }) => id === selectedAssetId
  );

  const [selectedAsset, selectAsset] = useSelectedAsset(
    currentSelectedAsset
      ? [
          {
            ...currentSelectedAsset,
            assetId: currentSelectedAsset?.id,
          } as AssetResource,
        ]
      : createInitialAssetResource(selectedAssetId)
  );

  useEffect(() => {
    updateSelectedAsset(selectedAsset[0]);
  }, [selectedAsset, updateSelectedAsset]);

  return (
    <FormField label={`${!hideTitle ? 'Asset' : ''}`}>
      <AssetForAssetModelSelect
        selectedAssetModel={selectedAssetModel}
        selectedAsset={selectedAsset}
        onSelectAsset={selectAsset}
        iotSiteWiseClient={iotSiteWiseClient}
      />
    </FormField>
  );
};
