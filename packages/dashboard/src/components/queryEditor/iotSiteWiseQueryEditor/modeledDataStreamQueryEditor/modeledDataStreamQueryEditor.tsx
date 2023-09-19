import Box from '@cloudscape-design/components/box';
import React, { useState } from 'react';

import { AssetExplorer } from './assetExplorer';
import { ModeledDataStreamExplorer } from './modeledDataStreamExplorer';
import { AssetSummary, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { ModeledDataStream } from './modeledDataStreamExplorer/types';
import { DataStreamSearch } from '../dataStreamSearch/dataStreamSearch';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { BROWSE_SEGMENT_ID, BrowseSearchToggle, useBrowseSearchToggle } from './browseSearchToggle';

export interface ModeledDataStreamQueryEditorProps {
  onClickAdd: (modeledDataStreams: ModeledDataStream[]) => void;
  iotSiteWiseClient: IoTSiteWiseClient;
  iotTwinMakerClient: IoTTwinMakerClient;
}

export function ModeledDataStreamQueryEditor({
  onClickAdd,
  iotSiteWiseClient,
  iotTwinMakerClient,
}: ModeledDataStreamQueryEditorProps) {
  const [selectedAsset, setSelectedAsset] = useState<AssetSummary | undefined>(undefined);
  function handleOnSelectAsset(asset?: AssetSummary) {
    setSelectedAsset(asset);
  }

  const { selectedSegment, onChangeSegment } = useBrowseSearchToggle();

  const [searchedDataStreams, setSearchedDataStreams] = useState<ModeledDataStream[] | undefined>(undefined);

  return (
    <Box padding={{ horizontal: 's' }}>
      <BrowseSearchToggle selectedSegment={selectedSegment} onChange={onChangeSegment} />

      {selectedSegment === BROWSE_SEGMENT_ID ? (
        <AssetExplorer client={iotSiteWiseClient} onSelect={handleOnSelectAsset} />
      ) : (
        <DataStreamSearch
          onSearch={(dataStreams) => {
            if (dataStreams.length > 0) {
              setSearchedDataStreams(dataStreams);
            } else {
              setSearchedDataStreams(undefined);
            }
          }}
          iotSiteWiseClient={iotSiteWiseClient}
          iotTwinMakerClient={iotTwinMakerClient}
        />
      )}

      <ModeledDataStreamExplorer
        client={iotSiteWiseClient}
        onClickAddModeledDataStreams={onClickAdd}
        selectedAssetId={selectedAsset?.id}
        dataStreams={searchedDataStreams}
      />
    </Box>
  );
}
