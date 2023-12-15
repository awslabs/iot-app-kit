import React from 'react';

import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import FormField from '@cloudscape-design/components/form-field';

import { AssetForAssetModelSelect } from '../queryEditor/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/assetsForAssetModelSelect/assetForAssetModelSelect';
import { useAssetsForAssetModel } from '../queryEditor/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/assetsForAssetModelSelect/useAssetsForAssetModel/useAssetsForAssetModel';
import { useModelBasedQuery } from '../queryEditor/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/modelBasedQuery/useModelBasedQuery';

type AssetModelSelectOptions = {
  client: IoTSiteWiseClient;
  assetModelId: string;
  selectedAssetId?: string;
  hideTitle?: boolean;
  controlId?: string;
};
export const AssetModelSelect = ({
  client,
  assetModelId,
  selectedAssetId,
  hideTitle = false,
  controlId,
}: AssetModelSelectOptions) => {
  const { updateSelectedAsset } = useModelBasedQuery();

  const { assetSummaries } = useAssetsForAssetModel({ assetModelId, client, fetchAll: true });

  const selectedAsset = assetSummaries.find(({ id }) => id === selectedAssetId);

  return (
    <FormField label={`${!hideTitle ? 'Asset' : ''}`}>
      <AssetForAssetModelSelect
        assetModelId={assetModelId}
        selectedAsset={selectedAsset}
        onSelectAsset={updateSelectedAsset}
        client={client}
        controlId={controlId}
      />
    </FormField>
  );
};
