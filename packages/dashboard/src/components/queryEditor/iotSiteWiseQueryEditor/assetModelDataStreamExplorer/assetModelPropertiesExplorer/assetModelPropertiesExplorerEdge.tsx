import React from 'react';

import {
  type AssetModelPropertySummary,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

import { AssetModelPropertiesTable } from './assetModelPropertiesTable/assetModelPropertiesTable';
import { type SelectedAssetModel } from '../useSelectedAssetModel';
import { type SelectedAssetModelProperties } from '../useSelectedAssetModelProperties';
import { useAssetModel } from '~/hooks/useAssetModel/useAssetModel';

export interface AssetExplorerProps {
  selectedAssetModel: SelectedAssetModel;
  selectedAssetModelProperties: SelectedAssetModelProperties;
  onSelect: (assetModelProperties: AssetModelPropertySummary[]) => void;
  isWithoutHeader?: boolean;
  onSave?: () => void;
  saveDisabled?: boolean;
  client: IoTSiteWiseClient;
}

/**
 * This is the Edge version of the AssetModelPropertiesExplorer;
 * The difference in the Edge version is that it is using the `useAssetModel` hook instead of `useAssetModelProperties` to mitigate the missing API ListAssetModelProperties.
 * Can remove this component once ListAssetModelProperties is available on edge.
 */
export const AssetModelPropertiesExplorerEdge = ({
  client,
  selectedAssetModel,
  selectedAssetModelProperties,
  onSelect,
  onSave,
  saveDisabled,
}: AssetExplorerProps) => {
  const assetModelId = selectedAssetModel?.id ?? '';

  const {
    assetModel: assetModelPropertySummaries,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useAssetModel({
    assetModelId,
    client,
  });

  const fetchNextPage = () => {}; // NOOP; all properties fetched;
  const hasNextPage = false;

  return (
    <AssetModelPropertiesTable
      onClickNextPage={fetchNextPage}
      onSelectAssetModelProperties={onSelect}
      assetModelProperties={assetModelPropertySummaries || []}
      selectedAssetModelProperties={selectedAssetModelProperties}
      isLoading={isLoading || isFetching}
      isError={isError}
      retry={refetch}
      hasNextPage={hasNextPage}
      onSave={onSave}
      saveDisabled={saveDisabled}
    />
  );
};
