import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { useModeledDataStreams } from './useModeledDataStreams';
import { ModeledDataStreamTable } from './modeledDataStreamTable';
import type { ModeledDataStream } from './types';
import { SelectedAsset } from '../types';

export interface ModeledDataStreamExplorerProps {
  onClickAddModeledDataStreams: (modeledDataStreams: ModeledDataStream[]) => void;
  onClickNextPage?: () => void;
  selectedAsset?: SelectedAsset;
  dataStreams?: ModeledDataStream[];
  client: IoTSiteWiseClient;
  hasNextPage?: boolean;
  isFetching?: boolean;
}

export function ModeledDataStreamExplorer({
  onClickAddModeledDataStreams,
  onClickNextPage,
  selectedAsset,
  dataStreams,
  client,
  hasNextPage,
  isFetching,
}: ModeledDataStreamExplorerProps) {
  const { assetProperties, isFetching: isFetchingAssetProperties } = useModeledDataStreams({
    assetProps: selectedAsset ? [selectedAsset] : [],
    client,
  });

  return (
    <ModeledDataStreamTable
      onClickAddModeledDataStreams={onClickAddModeledDataStreams}
      onClickNextPage={onClickNextPage}
      modeledDataStreams={dataStreams ?? assetProperties}
      selectedAsset={selectedAsset}
      isLoading={isFetching ?? isFetchingAssetProperties}
      client={client}
      hasNextPage={hasNextPage}
    />
  );
}
