import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { useModeledDataStreams } from './useModeledDataStreams';
import { ModeledDataStreamTable } from './modeledDataStreamTable';
import type { ModeledDataStream } from './types';
import { SelectedAsset } from '../types';

export interface ModeledDataStreamExplorerProps {
  onClickAddModeledDataStreams: (
    modeledDataStreams: ModeledDataStream[]
  ) => void;
  onClickNextPage?: () => void;
  selectedAsset?: SelectedAsset;
  dataStreams?: ModeledDataStream[];
  client: IoTSiteWiseClient;
  hasNextPage?: boolean;
  isFetching?: boolean;
  isSearchError?: boolean;
  searchQuery?: string;
}

export function ModeledDataStreamExplorer({
  onClickAddModeledDataStreams,
  onClickNextPage,
  selectedAsset,
  dataStreams,
  client,
  hasNextPage,
  isFetching,
  isSearchError,
  searchQuery,
}: ModeledDataStreamExplorerProps) {
  const {
    assetProperties,
    isFetching: isFetchingAssetProperties,
    isError: isAssetPropertiesError,
  } = useModeledDataStreams({
    assetProps: selectedAsset ? [selectedAsset] : [],
    client,
  });
  const modeledDataStreamsTitle = isSearchError
    ? `Search result for "${searchQuery}" (0)`
    : 'Modeled data streams (0)';

  console.log('ModeledDataStreamTable', dataStreams, assetProperties);
  return (
    <ModeledDataStreamTable
      onClickAddModeledDataStreams={onClickAddModeledDataStreams}
      onClickNextPage={onClickNextPage}
      modeledDataStreams={dataStreams ?? assetProperties}
      selectedAsset={selectedAsset}
      isLoading={isFetching ?? isFetchingAssetProperties}
      isError={isSearchError ?? isAssetPropertiesError}
      client={client}
      modeledDataStreamsTitle={modeledDataStreamsTitle}
      hasNextPage={hasNextPage}
    />
  );
}
