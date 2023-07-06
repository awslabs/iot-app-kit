import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import React, { useState } from 'react';

import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';
import { ResourceExplorer, ResourceExplorerProps } from './resourceExplorer';
import { StreamExplorer } from './streamExplorer';
import { AdvancedSearch } from './advancedSearch/advancedSearch';

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
  const [showModel, setShowModal] = useState<boolean>(false);

  const onClick = () => {
    setShowModal(true);
  };

  const onDismissModal = () => {
    setShowModal(false);
  };

  // TODO: pass assets and properties to <ResourceExplorer> and <StreamExplorer>
  const onSubmitModal = () => {
    setShowModal(false);
  };

  // these assets will be described and their asset properties listed by the stream explorer
  const selectedAssetIds = selectedAssets
    .filter((asset): asset is typeof asset & { id: string } => asset.id != null)
    .map(({ id }) => id);

  return (
    <QueryEditorErrorBoundary>
      {showModel && <AdvancedSearch client={client} onDismiss={onDismissModal} onSubmit={onSubmitModal} />}
      <SpaceBetween size='l'>
        <Button onClick={onClick}>Advanced search</Button>
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
