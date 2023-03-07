import React, { useState } from 'react';
import { ResourceExplorer } from '@iot-app-kit/react-components';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';
import { ResourceExplorerPanel } from '../components';
import { DefaultDashboardMessages } from '../../../messages';
import { TableProps, NonCancelableCustomEvent } from '@cloudscape-design/components';
import './style.css';

export type DescribedAssetsCache = Record<string, DescribeAssetResponse>;

interface StencilResourceExplorerProps {
  treeQuery: SiteWiseQuery;
}

export const StencilResourceExplorer: React.FC<StencilResourceExplorerProps> = ({ treeQuery }) => {
  const [currentBranchId, setCurrentBranchId] = useState<string | undefined>(undefined);

  const onSelectionChange = ({
    detail: { selectedItems },
  }: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<unknown>>) => {
    const nextSelectedItem = selectedItems[0] as unknown as { id: string };
    const nextBranchId = nextSelectedItem.id;
    setCurrentBranchId(nextBranchId);
  };

  return (
    <div className='stencil-resource-explorer'>
      <div className='stencil-resource-explorer-tree'>
        <ResourceExplorer query={treeQuery?.assetTree?.fromRoot()} onSelectionChange={onSelectionChange} />
      </div>

      <div className='stencil-resource-explorer-assets'>
        <ResourceExplorerPanel assetId={currentBranchId} messageOverrides={DefaultDashboardMessages} />
      </div>
    </div>
  );
};
