import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import React, { useEffect, useState } from 'react';

import { DataStreamSearchForm } from './dataStreamSearchForm';
import { useSearch } from './useSearch';
import type { SearchFields } from './types';
import { ModeledDataStream } from '../modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';

export interface DataStreamSearchProps {
  onSearch: (modeledDataStreams: ModeledDataStream[]) => void;
  iotSiteWiseClient: IoTSiteWiseClient;
  iotTwinMakerClient: IoTTwinMakerClient;
}

/** Advanced search for exploring your AWS IoT SiteWise properties. */
export function DataStreamSearch({ onSearch, iotSiteWiseClient, iotTwinMakerClient }: DataStreamSearchProps) {
  const [searchFieldValues, setSearchFieldValues] = useState<SearchFields>({ workspace: null, searchQuery: '' });

  const workspaceId =
    searchFieldValues.workspace != null && 'value' in searchFieldValues.workspace
      ? searchFieldValues.workspace.value
      : undefined;

  const { modeledDataStreams } = useSearch({
    workspaceId: workspaceId ?? '',
    client: iotTwinMakerClient,
    searchQuery: searchFieldValues.searchQuery,
  });

  useEffect(() => {
    onSearch(modeledDataStreams);
  }, [modeledDataStreams]);

  return (
    <DataStreamSearchForm
      iotSiteWiseClient={iotSiteWiseClient}
      iotTwinMakerClient={iotTwinMakerClient}
      onSubmit={setSearchFieldValues}
    />
  );
}
