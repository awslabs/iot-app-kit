import Box from '@cloudscape-design/components/box';
import React, { useState } from 'react';

import { AssetExplorer } from './assetExplorer';
import { ModeledDataStreamExplorer } from './modeledDataStreamExplorer';
import { AssetSummary, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { ModeledDataStream } from './modeledDataStreamExplorer/types';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import {
  BROWSE_SEGMENT_ID,
  BrowseSearchToggle,
  useBrowseSearchToggle,
  ASSET_MODEL_SEGMENT_ID,
} from './browseSearchToggle';
import { useSearch } from '../dataStreamSearch/useSearch';
import { SearchFields } from '../dataStreamSearch/types';
import { DataStreamSearch } from '../dataStreamSearch';
import { AssetModelSelect } from '../assetModelDataStreamExplorer/assetModelExplorer/assetModelSelection/assetModelSelect';
import { useSelectedAssetModel } from '../assetModelDataStreamExplorer/useSelectedAssetModel';
import { Header, SpaceBetween } from '@cloudscape-design/components';

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
  const [selectedAsset, setSelectedAsset] = useState<AssetSummary | undefined>(
    undefined
  );
  function handleOnSelectAsset(asset?: AssetSummary) {
    setSelectedAsset(asset);
  }

  const { selectedSegment, onChangeSegment } = useBrowseSearchToggle();

  const [searchFieldValues, setSearchFieldValues] = useState<SearchFields>({
    workspace: null,
    searchQuery: '',
  });

  const workspaceId =
    searchFieldValues.workspace != null &&
    'value' in searchFieldValues.workspace
      ? searchFieldValues.workspace.value
      : undefined;

  const {
    modeledDataStreams,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isError,
  } = useSearch({
    workspaceId: workspaceId ?? '',
    client: iotTwinMakerClient,
    searchQuery: searchFieldValues.searchQuery,
  });

  const [selectedAssetModel, setSelectedAssetModel] = useSelectedAssetModel();

  function onSelectAssetModel(assetModel: typeof selectedAssetModel) {
    setSelectedAssetModel(assetModel);
    setSelectedAsset(undefined);
  }

  return (
    <Box padding={{ horizontal: 's' }}>
      <BrowseSearchToggle
        selectedSegment={selectedSegment}
        onChange={onChangeSegment}
      />

      {selectedSegment === BROWSE_SEGMENT_ID ? (
        <>
          <AssetExplorer
            client={iotSiteWiseClient}
            onSelect={handleOnSelectAsset}
          />
          <br />
          {selectedAsset != null && (
            <ModeledDataStreamExplorer
              client={iotSiteWiseClient}
              onClickAddModeledDataStreams={onClickAdd}
              selectedAsset={
                selectedAsset?.id && selectedAsset?.assetModelId
                  ? {
                      assetId: selectedAsset.id,
                      assetModelId: selectedAsset.assetModelId,
                    }
                  : undefined
              }
            />
          )}
        </>
      ) : selectedSegment === ASSET_MODEL_SEGMENT_ID ? (
        <SpaceBetween size='s'>
          <Header
            variant='h3'
            description='Find modeled data streams by asset model.'
          >
            Find modeled data streams
          </Header>
          <AssetModelSelect
            client={iotSiteWiseClient}
            selectedAssetModel={selectedAssetModel}
            onSelectAssetModel={
              onSelectAssetModel as typeof setSelectedAssetModel
            }
          />
          {selectedAssetModel != null && (
            <AssetExplorer
              assetModelId={selectedAssetModel.id}
              client={iotSiteWiseClient}
              onSelect={handleOnSelectAsset}
            />
          )}
          {selectedAssetModel != null && selectedAsset != null && (
            <ModeledDataStreamExplorer
              client={iotSiteWiseClient}
              onClickAddModeledDataStreams={onClickAdd}
              selectedAsset={
                selectedAsset?.id && selectedAsset?.assetModelId
                  ? {
                    assetId: selectedAsset.id,
                    assetModelId: selectedAsset.assetModelId,
                  }
                  : undefined
              }
            />
          )}
        </SpaceBetween>
      ) : (
        <>
          <DataStreamSearch
            onSubmit={setSearchFieldValues}
            client={iotTwinMakerClient}
          />
          {searchFieldValues.searchQuery.length > 0 && (
            <ModeledDataStreamExplorer
              hasNextPage={hasNextPage}
              isFetching={isFetching}
              client={iotSiteWiseClient}
              dataStreams={modeledDataStreams}
              onClickAddModeledDataStreams={onClickAdd}
              onClickNextPage={fetchNextPage}
              isSearchError={isError}
              searchQuery={searchFieldValues.searchQuery}
            />
          )}
        </>
      )}
    </Box>
  );
}
