import Tabs from '@cloudscape-design/components/tabs';
import React from 'react';

import { ModeledDataStreamQueryEditor } from './modeledDataStreamQueryEditor';
import { UnmodeledDataStreamQueryEditor } from './unmodeledDataStreamExplorer';
import { querySelectionConverter } from './querySelectionConverter';
import type { ModeledDataStream } from './modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';
import type { UnmodeledDataStream } from './unmodeledDataStreamExplorer/types';
import { useQuery } from '../useQuery';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';

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
  function handleClickAddModeledDataStreams(newModeledDataStreams: ModeledDataStream[]) {
    onUpdateQuery((currentQuery) => {
      const currentModeledDataStreams: Pick<ModeledDataStream, 'assetId' | 'propertyId'>[] = currentQuery
        ? currentQuery.assets?.flatMap(({ assetId, properties }) =>
            properties.map(({ propertyId }) => ({ assetId, propertyId }))
          ) ?? []
        : [];

      const updatedModeledDataStreams = [...currentModeledDataStreams];

      newModeledDataStreams.forEach((newModeledDataStream) => {
        if (
          !updatedModeledDataStreams.some(
            (modeledDataStream) =>
              modeledDataStream.assetId === newModeledDataStream.assetId &&
              modeledDataStream.propertyId === newModeledDataStream.propertyId
          )
        ) {
          updatedModeledDataStreams.push(newModeledDataStream);
        }
      });

      const newQuery = querySelectionConverter.toQuery({
        modeledDataStreams: updatedModeledDataStreams as ModeledDataStream[],
        unmodeledDataStreams: [],
      });

      return {
        ...currentQuery,
        assets: newQuery.assets,
      };
    });
  }

  function handleClickAddUnmodeledDataStreams(newUnmodeledDataStreams: UnmodeledDataStream[]) {
    onUpdateQuery((currentQuery) => {
      const currentUnmodeledDataStreams: Pick<UnmodeledDataStream, 'propertyAlias'>[] = currentQuery
        ? currentQuery.properties ?? []
        : [];

      const updatedUnmodeledDataStreams = [...currentUnmodeledDataStreams];

      newUnmodeledDataStreams.forEach((newUnmodeledDataStream) => {
        if (
          !updatedUnmodeledDataStreams.some(
            (unmodeledDataStream) => unmodeledDataStream.propertyAlias === newUnmodeledDataStream.propertyAlias
          )
        ) {
          updatedUnmodeledDataStreams.push(newUnmodeledDataStream);
        }
      });

      const newQuery = querySelectionConverter.toQuery({
        modeledDataStreams: [],
        unmodeledDataStreams: updatedUnmodeledDataStreams as UnmodeledDataStream[],
      });

      return {
        ...currentQuery,
        properties: newQuery.properties,
      };
    });
  }

  return (
    <Tabs
      tabs={[
        {
          label: 'Modeled',
          id: 'explore-modeled-tab',
          content: (
            <ModeledDataStreamQueryEditor
              onClickAdd={handleClickAddModeledDataStreams}
              iotSiteWiseClient={iotSiteWiseClient}
              iotTwinMakerClient={iotTwinMakerClient}
            />
          ),
        },
        {
          label: 'Unmodeled',
          id: 'explore-unmodeled-tab',
          content: (
            <UnmodeledDataStreamQueryEditor
              onClickAdd={handleClickAddUnmodeledDataStreams}
              client={iotSiteWiseClient}
            />
          ),
        },
      ]}
    />
  );
}
