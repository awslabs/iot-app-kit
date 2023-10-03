import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { useModeledDataStreams } from './useModeledDataStreams';
import { ModeledDataStreamTable } from './modeledDataStreamTable';
import type { ModeledDataStream } from './types';

export interface ModeledDataStreamExplorerProps {
  onClickAddModeledDataStreams: (modeledDataStreams: ModeledDataStream[]) => void;
  selectedAssetId?: string;
  dataStreams?: ModeledDataStream[];
  client: IoTSiteWiseClient;
}

export function ModeledDataStreamExplorer({
  onClickAddModeledDataStreams,
  selectedAssetId,
  dataStreams,
  client,
}: ModeledDataStreamExplorerProps) {
  const { assetProperties, isFetching: isFetchingAssetProperties } = useModeledDataStreams({
    assetIds: selectedAssetId ? [selectedAssetId] : [],
    client,
  });

  return (
    <ModeledDataStreamTable
      onClickAddModeledDataStreams={onClickAddModeledDataStreams}
      modeledDataStreams={dataStreams ?? assetProperties}
      selectedAssetId={selectedAssetId}
      isLoading={isFetchingAssetProperties}
      client={client}
    />
  );
}
