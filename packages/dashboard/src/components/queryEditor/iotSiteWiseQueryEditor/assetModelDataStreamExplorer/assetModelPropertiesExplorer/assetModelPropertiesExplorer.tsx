import React from 'react';

import {
  AssetModelPropertySummary,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
// import { useAssetModelProperties } from './useAssetModelProperties/useAssetModelProperties';
import { SelectedAssetModel } from '../useSelectedAssetModel';
import { AssetModelPropertiesTable } from './assetModelPropertiesTable/assetModelPropertiesTable';
import { SelectedAssetModelProperties } from '../useSelectedAssetModelProperties';
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

export const AssetModelPropertiesExplorer = ({
  client,
  selectedAssetModel,
  selectedAssetModelProperties,
  onSelect,
  onSave,
  saveDisabled,
}: AssetExplorerProps) => {
  const assetModelId = selectedAssetModel?.id ?? '';
  // const {
  //   assetModelPropertySummaries,
  //   hasNextPage = false,
  //   isFetching,
  //   isLoading,
  //   isError,
  //   fetchNextPage,
  //   refetch,
  // } = useAssetModelProperties({ client, assetModelId });

  const {
    assetModel: assetModelPropertySummaries,
    // hasNextPage = false,
    isFetching,
    isLoading,
    isError,
    // fetchNextPage,
    // refetch,
   } = useAssetModel({
    assetModelId,
    client,
  });

  const fetchNextPage = () => {};
  const refetch = () => {};
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
