import React from 'react';

import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { AssetModelSelect } from './assetModelSelect';
import { useModelBasedQuery } from '../queryEditor/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/modelBasedQuery/useModelBasedQuery';

type AssetModelSelectionOptions = {
  client: IoTSiteWiseClient;
};

export const AssetModelSelection = ({ client }: AssetModelSelectionOptions) => {
  const { assetModelId, assetIds, hasModelBasedQuery } = useModelBasedQuery();
  const selectedAssetId = assetIds?.at(0);

  if (!hasModelBasedQuery || !assetModelId || !selectedAssetId) return null;

  return <AssetModelSelect assetModelId={assetModelId} selectedAssetId={selectedAssetId} client={client} />;
};
