import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';
import TextContent from '@cloudscape-design/components/text-content';
import { TwinMakerKGQueryDataModule } from '@iot-app-kit/source-iottwinmaker';
import Box from '@cloudscape-design/components/box';
import React, { useState } from 'react';

import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';
import { ResourceExplorer, ResourceExplorerProps } from './resourceExplorer';
import { StreamExplorer } from './streamExplorer';
import { AdvancedSearch } from './advancedSearch/advancedSearch';
import { Property } from './advancedSearch/model/property';

export interface QueryEditorProps {
  client: IoTSiteWiseClient;
  // Enables Advanced Search if provided
  kGDatamodule?: TwinMakerKGQueryDataModule;
}

/**
 * User interface element enabling users to manage their data source queries.
 *
 * @remarks
 *
 * At this highest level, the Que lorer components.
 */
export function QueryEditor({ client, kGDatamodule }: QueryEditorProps) {
  const [selectedAssets, setSelectedAssets] = useState<ResourceExplorerProps['selectedAssets']>([]);
  const [assetId, setAssetId] = useState<string | undefined>(undefined);

  // TODO: Use selectedProperties to add properties to dashboard when "Add" is clicked
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);

  // TODO: Remove once we add the "add" button
  console.log(selectedProperties);

  // these assets will be described and their asset properties listed by the stream explorer
  const selectedAssetIds = selectedAssets
    .filter((asset): asset is typeof asset & { id: string } => asset.id != null)
    .map(({ id }) => id);

  const resourceExplorerTab = {
    label: 'Browse assets',
    id: 'first',
    content: (
      <Box padding='s'>
        <SpaceBetween size='m' direction='vertical'>
          <TextContent>
            <h3>Browse Assets</h3>
          </TextContent>
          <ResourceExplorer
            client={client}
            selectedAssets={selectedAssets}
            onSelect={setSelectedAssets}
            assetId={assetId}
            onChangeAssetId={setAssetId}
          />
          <StreamExplorer client={client} assetIds={selectedAssetIds} />
        </SpaceBetween>
      </Box>
    ),
  };

  if (kGDatamodule) {
    const advancedSearchTab = {
      label: 'Advanced search',
      id: 'second',
      content: (
        <Box padding='s'>
          <SpaceBetween size='m' direction='vertical'>
            <TextContent>
              <h2>Search</h2>
            </TextContent>
            <AdvancedSearch kGDatamodule={kGDatamodule} onSelect={setSelectedProperties} />
          </SpaceBetween>
        </Box>
      ),
    };

    return (
      <QueryEditorErrorBoundary>
        <Tabs tabs={[resourceExplorerTab, advancedSearchTab]} />
      </QueryEditorErrorBoundary>
    );
  } else {
    return (
      <QueryEditorErrorBoundary>
        <Tabs tabs={[resourceExplorerTab]} />
      </QueryEditorErrorBoundary>
    );
  }
}
