import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import SpaceBetween from '@cloudscape-design/components/space-between';
import React, { useState } from 'react';

import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';
import { ResourceExplorer, ResourceExplorerProps } from './resourceExplorer';
import { StreamExplorer } from './streamExplorer';

export interface QueryEditorProps {
  client: IoTSiteWiseClient;
}

/**
 * User interface element enabling users to manage their data source queries.
 *
 * @remarks
 *
 * At this highest level, the QueryEditor's responsibility is to manage the state synchronizing the
 * ResourceExplorer and StreamExplorer components.
 */
export function QueryEditor({ client }: QueryEditorProps) {
  const [selectedAssets, setSelectedAssets] = useState<ResourceExplorerProps['selectedAssets']>([]);
  const [assetId, setAssetId] = useState<string | undefined>(undefined);

  // these assets will be described and their asset properties listed by the stream explorer
  const selectedAssetIds = selectedAssets
    .filter((asset): asset is typeof asset & { id: string } => asset.id != null)
    .map(({ id }) => id);

  return (
    <QueryEditorErrorBoundary>
      <SpaceBetween size='l'>
        <ResourceExplorer
          client={client}
          selectedAssets={selectedAssets}
          onSelect={setSelectedAssets}
          assetId={assetId}
          onChangeAssetId={setAssetId}
        />
        <StreamExplorer client={client} assetIds={selectedAssetIds} />
      </SpaceBetween>
    </QueryEditorErrorBoundary>
  );
}
