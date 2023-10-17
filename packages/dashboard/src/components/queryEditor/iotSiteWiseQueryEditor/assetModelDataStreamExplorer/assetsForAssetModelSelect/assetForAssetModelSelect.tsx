import React from 'react';

import { AssetSummary, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import Select, { SelectProps } from '@cloudscape-design/components/select';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { OptionsLoadItemsDetail } from '@cloudscape-design/components/internal/components/dropdown/interfaces';
import { SelectedAsset } from '../useSelectedAsset';
import { isEnabled, useAssetsForAssetModel } from './useAssetsForAssetModel/useAssetsForAssetModel';

export type AssetForAssetModelSelectOptions = {
  assetModelId?: string;
  selectedAsset?: SelectedAsset;
  onSelectAsset: (assetSummary: AssetSummary | undefined) => void;
  client: IoTSiteWiseClient;
};

const getStatus = ({
  isError,
  isFetching,
  isLoading,
  hasNextPage,
}: {
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  hasNextPage: boolean;
}) => {
  if (isLoading || isFetching) return 'loading';
  else if (isError) return 'error';
  else if (hasNextPage) return 'pending';
  return 'finished';
};

const mapAssetToOption = (asset: AssetSummary) => ({
  id: asset?.id,
  label: asset?.name,
  value: asset?.id,
});

export const AssetForAssetModelSelect = ({
  client,
  assetModelId,
  selectedAsset,
  onSelectAsset,
}: AssetForAssetModelSelectOptions) => {
  const {
    assetSummaries,
    // status,
    isError,
    isFetching,
    isLoading,
    // isSuccess,
    hasNextPage = false,
    fetchNextPage,
    refetch,
  } = useAssetsForAssetModel({ assetModelId, client });

  const selectedAssetOption = selectedAsset ? mapAssetToOption(selectedAsset) : null;

  const assetOptions = assetSummaries.map(mapAssetToOption);

  const onLoadItems: NonCancelableEventHandler<OptionsLoadItemsDetail> = () => {
    if (isError) {
      // triggered by cloudscape retry button
      refetch();
    } else if (hasNextPage) {
      fetchNextPage();
    }
  };

  const onChange: NonCancelableEventHandler<SelectProps.ChangeDetail> = (e) => {
    const selected = assetSummaries.find((ams) => ams?.id === e.detail.selectedOption.value);
    if (!selected) return;
    onSelectAsset(selected);
  };

  return (
    <Select
      virtualScroll={assetOptions.length > 500}
      disabled={!isEnabled(assetModelId)}
      selectedOption={selectedAssetOption}
      options={assetOptions}
      onChange={onChange}
      empty='No Assets'
      filteringType='auto'
      filteringPlaceholder='Find an asset'
      filteringAriaLabel='Find an asset'
      statusType={getStatus({ isError, isFetching, isLoading, hasNextPage })}
      placeholder='Select an asset'
      loadingText='Loading assets'
      errorText='Error fetching assets'
      recoveryText='Retry'
      finishedText='End of all results'
      onLoadItems={onLoadItems}
    />
  );
};
