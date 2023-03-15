import React, { useState } from 'react';
import { ResourceExplorer } from '@iot-app-kit/react-components';
import { ResourceExplorerPanel } from '../components/panel';
import { DefaultDashboardMessages } from '../../../messages';
import type { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import type { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';
import type { TableProps, NonCancelableCustomEvent } from '@cloudscape-design/components';

import './style.css';

export type DescribedAssetsCache = Record<string, DescribeAssetResponse>;

interface StencilResourceExplorerProps {
  treeQuery: SiteWiseQuery['assetTree']['fromRoot'];
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
        <ResourceExplorer query={treeQuery()} onSelectionChange={onSelectionChange} />
      </div>

      <div className='stencil-resource-explorer-assets'>
        <ResourceExplorerPanel assetId={currentBranchId} messageOverrides={DefaultDashboardMessages} />
      </div>
    </div>
  );
};
