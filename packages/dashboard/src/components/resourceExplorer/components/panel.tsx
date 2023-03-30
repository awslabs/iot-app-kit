import React, { memo } from 'react';
import { useDrag } from 'react-dnd';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import { ItemTypes } from '../../dragLayer/itemTypes';

import './style.css';
import { useAssetDescriptionAsync } from '~/hooks/useAssetDescriptionMapAsync';
import type { AlarmSummary, AssetSummary, PropertySummary } from './mapper';
import { mapAssetDescriptionToAssetSummary } from './mapper';
import type { DashboardMessages } from '~/messages';

export interface ResourceExplorerPanelProps {
  assetId: string | undefined;
  messageOverrides: DashboardMessages;
}

type PanelSummary = {
  type: 'header';
  name: string;
};

type PanelDrag = {
  type: 'property' | 'alarm';
  name: string;
  assetSummary: Pick<AssetSummary, 'assetId' | 'assetName' | 'properties'>;
};

type PanelItem = PanelDrag | PanelSummary;

export type ResourcePanelItem = Pick<PanelDrag, 'name' | 'assetSummary'>;

export const ResourceExplorerPanelAssetPropertyDragGhost = ({ item }: { item: PanelDrag }) => {
  return (
    <div className='resouce-explorer-panel-asset resouce-explorer-panel-asset-ghost'>
      <Box margin={{ horizontal: 'm' }}>
        <div className='resource-explorer-panel-asset-property-drag-handle'>
          <Icon name='expand' />
        </div>
      </Box>
      <div className='resource-explorer-panel-asset-name'>{item.name}</div>
    </div>
  );
};

const PanelEmpty = ({ messageOverrides }: { messageOverrides: DashboardMessages }) => (
  <Box textAlign='center' padding={{ bottom: 's' }} variant='p' color='inherit'>
    {messageOverrides.resourceExplorer.panelEmptyLabel}
  </Box>
);

const Asset: React.FC<PanelDrag> = (item) => {
  const [, dragSource] = useDrag(() => {
    return {
      type: item.type === 'property' ? ItemTypes.ResourceExplorerAssetProperty : ItemTypes.ResourceExplorerAlarm,
      item: {
        name: item.name,
        assetSummary: item.assetSummary,
      },
    };
  });
  return (
    <div className='resouce-explorer-panel-asset'>
      <Box margin={{ horizontal: 'm' }}>
        <div className='resource-explorer-panel-asset-property-drag-handle' ref={dragSource}>
          <Icon name='expand' />
        </div>
      </Box>
      <span>{item.name}</span>
    </div>
  );
};

const Header: React.FC<{ name: string }> = ({ name }) => (
  <Box margin={{ horizontal: 'm' }} variant='awsui-key-label'>
    {name}
  </Box>
);

const tableColumnDefinitions = [
  {
    id: 'panel',
    header: null,
    cell: (cell: PanelItem) => {
      switch (cell.type) {
        case 'property':
        case 'alarm':
          return <Asset {...cell} />;
        case 'header':
          return <Header name={cell.name} />;
        default:
          return null;
      }
    },
  },
];

const mapPanelAssetSummary =
  (assetId: string, assetName: string) =>
  (type: 'property' | 'alarm') =>
  (summary: PropertySummary | AlarmSummary): PanelDrag => ({
    type,
    name: summary.name || '',
    assetSummary: {
      assetId,
      assetName,
      properties: 'properties' in summary ? summary.properties : [summary],
    },
  });

export const ResourceExplorerPanel: React.FC<ResourceExplorerPanelProps> = ({
  assetId: currentAssetId,
  messageOverrides,
}) => {
  const describedAsset = useAssetDescriptionAsync(currentAssetId);

  const { assetId, assetName, properties, alarms } = describedAsset
    ? mapAssetDescriptionToAssetSummary(describedAsset)
    : { properties: [], alarms: [], assetId: '', assetName: '' };

  const mapper = mapPanelAssetSummary(assetId || '', assetName || '');

  const items: PanelItem[] = [];

  if (properties.length > 0) {
    items.push({
      type: 'header',
      name: 'Asset properties',
    });
    items.push(...properties.map(mapper('property')));
  }

  if (alarms.length > 0) {
    items.push({
      type: 'header',
      name: 'Alarms',
    });
    items.push(...alarms.map(mapper('alarm')));
  }

  return (
    <Table
      variant='embedded'
      columnDefinitions={tableColumnDefinitions}
      items={items}
      trackBy='name'
      empty={<PanelEmpty messageOverrides={messageOverrides} />}
    />
  );
};

export default memo(ResourceExplorerPanel, (p, n) => p.assetId === n.assetId);
