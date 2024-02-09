import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import Tabs from '@cloudscape-design/components/tabs';
import React from 'react';

import { ModeledDataStreamQueryEditor } from './modeledDataStreamQueryEditor';
import { UnmodeledDataStreamQueryEditor } from './unmodeledDataStreamExplorer';
import { QueryExtender } from './queryExtender';
import type { ModeledDataStream } from './modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';
import type { UnmodeledDataStream } from './unmodeledDataStreamExplorer/types';
import { useQuery } from '../useQuery';
import { AssetModelDataStreamExplorer } from './assetModelDataStreamExplorer/assetModelDataStreamExplorer';

export interface IoTSiteWiseQueryEditorProps {
  onUpdateQuery: ReturnType<typeof useQuery>[1];
  iotSiteWiseClient: IoTSiteWiseClient;
  iotTwinMakerClient: IoTTwinMakerClient;
}

export function IoTSiteWiseQueryEditor({
  onUpdateQuery,
  iotSiteWiseClient,
  iotTwinMakerClient,
}: IoTSiteWiseQueryEditorProps) {
  function handleClickAddModeledDataStreams(
    newModeledDataStreams: ModeledDataStream[]
  ) {
    onUpdateQuery((currentQuery) => {
      const queryExtender = new QueryExtender(currentQuery);
      const updatedQuery = queryExtender.extendAssetQueries(
        newModeledDataStreams
      );

      return updatedQuery;
    });
  }

  function handleClickAddUnmodeledDataStreams(
    newUnmodeledDataStreams: UnmodeledDataStream[]
  ) {
    onUpdateQuery((currentQuery) => {
      const queryExtender = new QueryExtender(currentQuery);
      const updatedQuery = queryExtender.extendPropertyAliasQueries(
        newUnmodeledDataStreams
      );

      return updatedQuery;
    });
  }

  const modeledTab = {
    label: 'Modeled',
    id: 'explore-modeled-tab',
    content: (
      <ModeledDataStreamQueryEditor
        onClickAdd={handleClickAddModeledDataStreams}
        iotSiteWiseClient={iotSiteWiseClient}
        iotTwinMakerClient={iotTwinMakerClient}
      />
    ),
  };
  const unmodeledTab = {
    label: 'Unmodeled',
    id: 'explore-unmodeled-tab',
    content: (
      <UnmodeledDataStreamQueryEditor
        onClickAdd={handleClickAddUnmodeledDataStreams}
        client={iotSiteWiseClient}
      />
    ),
    disabled: true,
  };

  const assetModeledTab = {
    label: 'Dynamic assets',
    id: 'explore-asset-model-tab',
    content: <AssetModelDataStreamExplorer client={iotSiteWiseClient} />,
    disabled: true,
  };

  const defaultTabs = [modeledTab, unmodeledTab, assetModeledTab];

  return <Tabs tabs={defaultTabs} />;
}
