import React, { useEffect, useState, useContext } from 'react';
import { TreeQuery } from '@iot-app-kit/core';
import { BranchReference, SiteWiseAssetTreeNode } from '@iot-app-kit/source-iotsitewise';
import { AssetSummary, AssetHierarchy, DescribeAssetResponse, AssetCompositeModel } from '@aws-sdk/client-iotsitewise';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { IotResourceExplorerSearchbar, IotResourceExplorerPanel, IotResourceExplorerBreadcrumbs } from './components';
import { useBuildProvider } from './useBuildProvider';
import { describeCurrentAsset } from './describeCurrentAsset';
import { getCurrentAssets } from './getCurrentAssets';
import { getCurrentAssetProperties } from './getCurrentAssetProperties';
import { AssetQuery } from '@iot-app-kit/core';
import { DashboardMessages } from '../../messages';
import { useAssetProperties } from './useAssetProperties';
import { ClientContext } from '../dashboard/clientContext';

export const HIERARCHY_ROOT_ID = 'HIERARCHY_ROOT_ID';

export const isAlarm = (item: AssetCompositeModel | ExtendedPanelAssetSummary) => item.type === 'AWS/ALARM';

export interface ExtendedPanelAssetSummary {
  id?: string;
  name?: string;
  value?: unknown;
  description?: string;
  type?: string;
  assetCompositeModels?: AssetCompositeModel[];
  properties?: unknown[];
  hierarchies?: AssetHierarchy[];
  isHeader?: boolean;
  isAssetProperty?: boolean;
  queryAssetsParam?: AssetQuery[];
}

export type EitherAssetSummary = AssetSummary | ExtendedPanelAssetSummary;

export interface IotResourceExplorerProps {
  messageOverrides: DashboardMessages;
  treeQuery: TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
}

const retrieveAlarms = (describedAsset: DescribeAssetResponse) => {
  if (!describedAsset?.assetCompositeModels?.length) return [];
  return describedAsset.assetCompositeModels?.filter((model: AssetCompositeModel) => isAlarm(model));
};

export const IotResourceExplorer: React.FC<IotResourceExplorerProps> = ({ treeQuery, messageOverrides }) => {
  const [crumbs, setCrumbs] = useState<EitherAssetSummary[]>([]);
  const [panelItems, setPanelItems] = useState<EitherAssetSummary[]>([]);
  const [alarms, setAlarms] = useState<ExtendedPanelAssetSummary[]>([]);
  const [currentBranchId, setCurrentBranchId] = useState<string>(HIERARCHY_ROOT_ID);
  const { cache, update, hasKey } = useAssetProperties();
  const client = useContext(ClientContext);
  const { provider, errors } = useBuildProvider(treeQuery);
  if (errors.length) console.log(errors);

  const alarmsHeaderItem = {
    id: messageOverrides.resourceExplorer.alarmsHeader,
    name: messageOverrides.resourceExplorer.alarmsHeader,
    isHeader: true,
  };

  const navigateToBranch = (item: EitherAssetSummary) => {
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
    navigateToBranch(item as EitherAssetSummary);
    const nextCrumbs = crumbs;
    nextCrumbs.push(item as EitherAssetSummary);
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

  const getCachedCurrentAssetProperties = async (currentBranchId: string) => {
    if (currentBranchId && hasKey(currentBranchId)) {
      return cache[currentBranchId];
    }
    const currentAssetProperties = await getCurrentAssetProperties(currentBranchId, messageOverrides, client);
    update(currentBranchId, currentAssetProperties);
    return currentAssetProperties;
  };

  useEffect(() => {
    (async () => {
      const [currentAssets, currentAssetProperties, describedAsset] = await Promise.all([
        getCurrentAssets(provider, currentBranchId, messageOverrides),
        getCachedCurrentAssetProperties(currentBranchId),
        describeCurrentAsset(currentBranchId, client),
      ]);

      const nextAlarms = retrieveAlarms(describedAsset);
      setAlarms(nextAlarms);

      const nextPanelItems = currentAssetProperties.concat(currentAssets);
      const nextPanelItemsWithAlarmsHeader = [...nextPanelItems, ...(nextAlarms.length > 0 ? [alarmsHeaderItem] : [])];
      setPanelItems(nextPanelItemsWithAlarmsHeader);
    })();
  }, [JSON.stringify(provider?.branches), JSON.stringify(provider?.assetNodes), currentBranchId]);

  return (
    <div className="iot-resource-explorer">
      <Box padding="l">
        <SpaceBetween size="s">
          <IotResourceExplorerSearchbar
            provider={provider}
            assetPropertiesCache={cache}
            setCrumbsToSearch={setCrumbsToSearch}
            setPanelItems={setPanelItems}
            messageOverrides={messageOverrides}
          />

          <IotResourceExplorerBreadcrumbs crumbs={crumbs} setCrumbs={setCrumbs} handleCrumbClick={handleCrumbClick} />

          <IotResourceExplorerPanel
            alarms={alarms}
            panelItems={panelItems}
            handlePanelItemClick={handlePanelItemClick}
            messageOverrides={messageOverrides}
          />
        </SpaceBetween>
      </Box>
    </div>
  );
};
