import {
  type AssetSummary,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { AssetTable } from './assetTable';
import { useAssets } from './useAssets';
import { useParentAssetId } from './useParentAssetId';

export interface AssetExplorerProps {
  onSelect: (asset?: AssetSummary) => void;
  isWithoutHeader?: boolean;
  client: IoTSiteWiseClient;
}

/** User interface element enabling the exploration and selection of assets. */
export function AssetExplorer({
  onSelect,
  isWithoutHeader,
  client,
}: AssetExplorerProps) {
  const [parentAssetId, setParentAssetId] = useParentAssetId();
  const {
    assets,
    isFetching,
    fetchNextPage,
    hasNextPage = false,
    isError,
  } = useAssets({
    assetId: parentAssetId,
    client,
  });

  return (
    <AssetTable
      assets={assets}
      parentAssetId={parentAssetId}
      onClickAsset={setParentAssetId}
      onClickNextPage={fetchNextPage}
      onSelectAsset={onSelect}
      isLoading={isFetching}
      isError={isError}
      isWithoutHeader={isWithoutHeader}
      client={client}
      hasNextPage={hasNextPage}
    />
  );
}
