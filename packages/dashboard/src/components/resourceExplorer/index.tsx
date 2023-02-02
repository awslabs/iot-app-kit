import React, { useEffect, useState } from 'react';
import { TreeQuery } from '@iot-app-kit/core';
import { BranchReference, SiteWiseAssetTreeNode } from '@iot-app-kit/source-iotsitewise';
import { AssetSummary, AssetHierarchy } from '@aws-sdk/client-iotsitewise';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { IotResourceExplorerSearchbar, IotResourceExplorerPanel, IotResourceExplorerBreadcrumbs } from './components';
import { useBuildProvider } from './useBuildProvider';
import { AssetQuery } from '@iot-app-kit/core';
import { DashboardMessages } from '../../messages';
import { useAssetCache } from './useAssetCache';
import { describeCurrentAsset } from './describeCurrentAsset';
import { getCurrentAssets } from './getCurrentAssets';
export const HIERARCHY_ROOT_ID = 'HIERARCHY_ROOT_ID';

export interface ExtendedPanelAssetSummary {
  id?: string;
  name?: string;
  alias?: string;
  value?: unknown;
  isHeader?: boolean;
  isAssetProperty?: boolean;
  queryAssetsParam?: AssetQuery[];
}

export type EitherAssetSummary = AssetSummary | ExtendedPanelAssetSummary;

export interface IotResourceExplorerProps {
  messageOverrides: DashboardMessages;
  treeQuery: TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
}

export const IotResourceExplorer: React.FC<IotResourceExplorerProps> = ({ treeQuery, messageOverrides }) => {
  const [crumbs, setCrumbs] = useState<EitherAssetSummary[]>([]);
  const [panelItems, setPanelItems] = useState<EitherAssetSummary[]>([]);
  const [currentBranchId, setCurrentBranchId] = useState<string>(HIERARCHY_ROOT_ID);
  const { cache, searchCache, update, hasKey } = useAssetCache();
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

  const handlePanelItemClick = (item: ExtendedPanelAssetSummary) => {
    navigateToBranch(item as AssetSummary);
    const nextCrumbs = crumbs;
    nextCrumbs.push(item as AssetSummary);
    setCrumbs(nextCrumbs);
  };

  const setCrumbsToSearch = () => {
    setCrumbs([
      {
        name: messageOverrides.resourceExplorer.searchQueryHeader,
        isHeader: true,
      } as EitherAssetSummary,
    ]);
  };

  useEffect(() => {
    // if (hasKey(currentBranchId)) return;
    (async () => {
      const { asset } = await describeCurrentAsset(currentBranchId);
      const children = await getCurrentAssets(provider, currentBranchId);
      update(currentBranchId, { ...asset, children, id: currentBranchId });
    })();
  }, [currentBranchId, JSON.stringify(provider?.assetNodes)]);

  // useEffect(() => {

  // }, [JSON.stringify(cache, null, 2)]);

  const cachedAsset = cache[currentBranchId];
  const isLoaded = cachedAsset?.id;

  return (
    <div className="iot-resource-explorer">
      <Box padding="l">
        <SpaceBetween size="s">
          <IotResourceExplorerSearchbar
            provider={provider}
            searchCache={searchCache}
            assetPropertiesCache={cache}
            setCrumbsToSearch={setCrumbsToSearch}
            setPanelItems={setPanelItems}
            messageOverrides={messageOverrides}
          />

          <IotResourceExplorerBreadcrumbs crumbs={crumbs} setCrumbs={setCrumbs} handleCrumbClick={handleCrumbClick} />

          {isLoaded && (
            <IotResourceExplorerPanel
              asset={cachedAsset}
              panelItems={panelItems}
              handlePanelItemClick={handlePanelItemClick}
              messageOverrides={messageOverrides}
            />
          )}
        </SpaceBetween>
      </Box>
    </div>
  );
};
