import React, { useContext, useEffect, useState } from 'react';
import { ResourceExplorer } from '@iot-app-kit/react-components';
import { describeCurrentAsset } from '../describeCurrentAsset';
import { ClientContext } from '../../dashboard/clientContext';
import { ResourceExplorerPanel } from '../components';
import { DefaultDashboardMessages } from '../../../messages';
import { retrieveAlarms } from '../nextResourceExplorer';
import './style.css';
import type { SiteWiseAssetQuery, SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import type { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';
import type { EitherAssetSummary } from '../nextResourceExplorer';
import type { TableProps, NonCancelableCustomEvent } from '@cloudscape-design/components';

export type DescribedAssetsCache = Record<string, DescribeAssetResponse>;

const createPanelItems = (describedAssetsCache: DescribedAssetsCache, currentBranchId: string | undefined) => {
  if (!currentBranchId) return [];
  const asset = describedAssetsCache[currentBranchId];
  if (!currentBranchId || !asset?.assetProperties || !asset?.assetCompositeModels) return [];

  let panelItems: EitherAssetSummary[];
  panelItems =
    (currentBranchId &&
      asset?.assetProperties?.map(({ id, name, alias }) => {
        const item = {
          id: asset.assetId,
          name: `${alias || 'Unaliased'} (${name})`,
          queryAssetsParam: [
            {
              assetId: asset.assetId,
              properties: [
                {
                  propertyId: id,
                },
              ],
            },
          ] as SiteWiseAssetQuery['assets'],
          isAssetProperty: true,
        };
        return item;
      })) ||
    [];

  if (panelItems.length > 0) {
    panelItems.unshift({ name: 'Asset Properties', isHeader: true });
  }

  const alarms = retrieveAlarms(asset);
  if (alarms.length > 0) {
    const alarmsHeaderItem = {
      name: 'Alarms',
      isHeader: true,
    };
    panelItems = [...panelItems, alarmsHeaderItem, ...alarms];
  }

  return panelItems;
};

interface StencilResourceExplorerProps {
  treeQuery: SiteWiseQuery;
}

export const StencilResourceExplorer: React.FC<StencilResourceExplorerProps> = ({ treeQuery }) => {
  const [currentBranchId, setCurrentBranchId] = useState<string | undefined>(undefined);
  const [describedAssetsCache, setDescribedAssetsCache] = useState<DescribedAssetsCache>({});
  const client = useContext(ClientContext);

  const onSelectionChange = ({
    detail: { selectedItems },
  }: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<unknown>>) => {
    const nextSelectedItem = selectedItems[0] as unknown as { id: string };
    const nextBranchId = nextSelectedItem.id;
    setCurrentBranchId(nextBranchId);
  };

  useEffect(() => {
    if (!currentBranchId || describedAssetsCache[currentBranchId]) return;
    (async () => {
      const describeAssetCommandOutput = await describeCurrentAsset(currentBranchId, client);
      const nextDescribedAssetsCache = structuredClone(describedAssetsCache);
      nextDescribedAssetsCache[currentBranchId] = describeAssetCommandOutput;
      setDescribedAssetsCache(nextDescribedAssetsCache);
    })();
  }, [currentBranchId]);

  const panelItems = createPanelItems(describedAssetsCache, currentBranchId);

  return (
    <div className='stencil-resource-explorer'>
      <div className='stencil-resource-explorer-tree'>
        <ResourceExplorer query={treeQuery?.assetTree?.fromRoot()} onSelectionChange={onSelectionChange} />
      </div>

      <div className='stencil-resource-explorer-assets'>
        <ResourceExplorerPanel
          alarms={[]}
          panelItems={panelItems}
          handlePanelItemClick={() => {}}
          messageOverrides={DefaultDashboardMessages}
        />
      </div>
    </div>
  );
};
