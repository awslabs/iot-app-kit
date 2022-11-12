import React, { useEffect, useState } from 'react';
import { TreeQuery } from '@iot-app-kit/core';
import { BranchReference, SiteWiseAssetTreeNode } from '@iot-app-kit/source-iotsitewise';
import { AssetSummary, AssetHierarchy } from '@aws-sdk/client-iotsitewise';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { IotResourceExplorerSearchbar, IotResourceExplorerPanel, IotResourceExplorerBreadcrumbs } from './components';
import { useBuildProvider } from './useBuildProvider';
import { getCurrentItems } from './getCurrentItems';

export const HIERARCHY_ROOT_ID = 'HIERARCHY_ROOT_ID';

export interface IotResourceExplorerProps {
  treeQuery: TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
}

export const IotResourceExplorer = ({ treeQuery }: IotResourceExplorerProps) => {
  const [crumbs, setCrumbs] = useState<AssetSummary[]>([]);
  const [panelItems, setPanelItems] = useState<AssetSummary[] | []>([]);
  const [currentBranchId, setCurrentBranchId] = useState<string>(HIERARCHY_ROOT_ID);

  const { provider, errors } = useBuildProvider(treeQuery);
  if (errors.length) console.log(errors);

  const navigateToBranch = (item: AssetSummary) => {
    item.hierarchies?.forEach((hierarchy: AssetHierarchy) => {
      provider?.expand(new BranchReference(item.id, hierarchy.id as string));
    });
    if (item?.id) {
      setCurrentBranchId(item.id);
    }
  };

  const handleCrumbClick = (item: AssetSummary) => {
    navigateToBranch(item);
  };

  const handlePanelItemClick = (item: AssetSummary) => {
    navigateToBranch(item);
    const nextCrumbs = crumbs;
    nextCrumbs.push(item);
    setCrumbs(nextCrumbs);
  };

  useEffect(() => {
    const currentItems = getCurrentItems(provider, currentBranchId);
    setPanelItems(currentItems);
  }, [provider?.branches, provider?.assetNodes, currentBranchId]);

  return (
    <div className="iot-resource-explorer">
      <Box padding="l">
        <SpaceBetween size="s">
          <IotResourceExplorerSearchbar />

          <IotResourceExplorerBreadcrumbs crumbs={crumbs} setCrumbs={setCrumbs} handleCrumbClick={handleCrumbClick} />

          <IotResourceExplorerPanel panelItems={panelItems} handlePanelItemClick={handlePanelItemClick} />
        </SpaceBetween>
      </Box>
    </div>
  );
};
