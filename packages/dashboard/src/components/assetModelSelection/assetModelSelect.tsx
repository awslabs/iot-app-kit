import React from 'react';

import { AssetForAssetModelSelect } from '../queryEditor/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/assetsForAssetModelSelect/assetForAssetModelSelect';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useAssetsForAssetModel } from '../queryEditor/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/assetsForAssetModelSelect/useAssetsForAssetModel/useAssetsForAssetModel';
import { useModelBasedQuery } from '../queryEditor/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/modelBasedQuery/useModelBasedQuery';

type AssetModelSelectOptions = {
  client: IoTSiteWiseClient;
  assetModelId: string;
  selectedAssetId: string;
};
export const AssetModelSelect = ({ client, assetModelId, selectedAssetId }: AssetModelSelectOptions) => {
  const { updateSelectedAsset } = useModelBasedQuery();

  const { assetSummaries } = useAssetsForAssetModel({ assetModelId, client, fetchAll: true });

  const selectedAsset = assetSummaries.find(({ id }) => id === selectedAssetId);

  return (
    <AssetForAssetModelSelect
      assetModelId={assetModelId}
      selectedAsset={selectedAsset}
      onSelectAsset={updateSelectedAsset}
      client={client}
    />
  );
};
