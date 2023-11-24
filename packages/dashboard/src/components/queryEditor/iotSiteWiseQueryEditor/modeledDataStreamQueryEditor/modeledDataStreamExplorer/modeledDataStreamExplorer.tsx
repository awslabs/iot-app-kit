import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { useModeledDataStreams } from './useModeledDataStreams';
import { ModeledDataStreamTable } from './modeledDataStreamTable';
import type { ModeledDataStream } from './types';
import { SelectedAsset } from '../types';

export interface ModeledDataStreamExplorerProps {
  onClickAddModeledDataStreams: (modeledDataStreams: ModeledDataStream[]) => void;
  selectedAsset?: SelectedAsset;
  dataStreams?: ModeledDataStream[];
  client: IoTSiteWiseClient;
}

export function ModeledDataStreamExplorer({
  onClickAddModeledDataStreams,
  selectedAsset,
  dataStreams,
  client,
}: ModeledDataStreamExplorerProps) {
  const { assetProperties, isFetching: isFetchingAssetProperties } = useModeledDataStreams({
    assetProps: selectedAsset ? [selectedAsset] : [],
    client,
  });

  return (
    <ModeledDataStreamTable
      onClickAddModeledDataStreams={onClickAddModeledDataStreams}
      modeledDataStreams={dataStreams ?? assetProperties}
      selectedAsset={selectedAsset}
      isLoading={isFetchingAssetProperties}
      client={client}
    />
  );
}
