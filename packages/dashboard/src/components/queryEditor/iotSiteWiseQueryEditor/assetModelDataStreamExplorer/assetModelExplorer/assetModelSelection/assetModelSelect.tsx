import React from 'react';

import FormField from '@cloudscape-design/components/form-field';
import Select, { SelectProps } from '@cloudscape-design/components/select';
import { AssetModelSummary, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useAssetModels } from '../useAssetModels/useAssetModels';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { OptionsLoadItemsDetail } from '@cloudscape-design/components/internal/components/dropdown/interfaces';
import { SelectedAssetModel, UpdateSelectedAssetModel } from '../../useSelectedAssetModel';

type AssetModelSelectOptions = {
  selectedAssetModel?: SelectedAssetModel;
  onSelectAssetModel: UpdateSelectedAssetModel;
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

const mapAssetModelToOption = (assetModel: AssetModelSummary) => ({
  id: assetModel?.id,
  label: assetModel?.name,
  value: assetModel?.id,
});

export const AssetModelSelect = ({ client, selectedAssetModel, onSelectAssetModel }: AssetModelSelectOptions) => {
  const {
    assetModelSummaries,
    // status,
    isError,
    isFetching,
    isLoading,
    // isSuccess,
    hasNextPage = false,
    fetchNextPage,
    refetch,
  } = useAssetModels({ client });

  const selectedAssetModelOption = selectedAssetModel ? mapAssetModelToOption(selectedAssetModel) : null;

  const assetModelOptions = assetModelSummaries.map(mapAssetModelToOption);

  const onLoadItems: NonCancelableEventHandler<OptionsLoadItemsDetail> = () => {
    if (isError) {
      // triggered by cloudscape retry button
      refetch();
    } else if (hasNextPage) {
      fetchNextPage();
    }
  };

  const onChange: NonCancelableEventHandler<SelectProps.ChangeDetail> = (e) => {
    const selected = assetModelSummaries.find((ams) => ams?.id === e.detail.selectedOption.value);
    if (!selected) return;
    onSelectAssetModel(selected);
  };

  return (
    <FormField
      label='Asset model'
      description='Once you have selected an asset model, you may add its properties to a chart.'
    >
      <Select
        virtualScroll={assetModelOptions.length > 500}
        selectedOption={selectedAssetModelOption}
        options={assetModelOptions}
        onChange={onChange}
        empty='No Asset Models'
        filteringType='auto'
        filteringPlaceholder='Find an asset model'
        filteringAriaLabel='Find an asset model'
        statusType={getStatus({ isError, isFetching, isLoading, hasNextPage })}
        placeholder='Select an asset model'
        loadingText='Loading asset models'
        errorText='Error fetching asset models'
        recoveryText='Retry'
        finishedText='End of all results'
        onLoadItems={onLoadItems}
      />
    </FormField>
  );
};
