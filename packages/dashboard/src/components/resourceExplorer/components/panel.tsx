import React from 'react';
import { useDrag } from 'react-dnd';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import { ItemTypes } from '../../dragLayer/itemTypes';

import './style.css';
import { DashboardMessages } from '~/messages';
import { useAssetDescriptionAsync } from '~/hooks/useAssetDescriptionMapAsync';
import { AlarmSummary, AssetSummary, mapAssetDescriptionToAssetSummary, PropertySummary } from './mapper';

export interface ResourceExplorerPanelProps {
  assetId: string | undefined;
  messageOverrides: DashboardMessages;
}

type PanelSummary = {
  type: 'header';
  name: string;
};

type PanelDrag = {
  type: 'asset';
  name: string;
  assetSummary: Pick<AssetSummary, 'assetId' | 'assetName' | 'properties'>;
};

type PanelItem = PanelDrag | PanelSummary;

export type ResourcePanelItem = Pick<PanelDrag, 'name' | 'assetSummary'>;

export const ResourceExplorerPanelAssetPropertyDragGhost = ({ item }: { item: PanelDrag }) => {
  return (
    <div className='resource-explorer-panel-asset-property-drag-ghost'>
      <Icon name='expand' /> <Box variant='awsui-key-label'>{item.name}</Box>
    </div>
  );
};

const PanelEmpty = ({ messageOverrides }: { messageOverrides: DashboardMessages }) => (
  <Box textAlign='center' padding={{ bottom: 's' }} variant='p' color='inherit'>
    {messageOverrides.resourceExplorer.panelEmptyLabel}
  </Box>
);

const PanelAssetPropertyDragHandle = ({ item }: { item: PanelDrag }) => {
  const [, dragSource] = useDrag(() => {
    return {
      type: ItemTypes.ResourceExplorerAssetProperty,
      item: {
        name: item.name,
        assetSummary: item.assetSummary,
      },
    };
  });

  return (
    <div className='resource-explorer-panel-asset-property-drag-handle' ref={dragSource}>
      <Icon name='expand' />
    </div>
  );
};

const Header: React.FC<{ name: string }> = ({ name }) => <Box variant='awsui-key-label'>{name}</Box>;

const Property: React.FC<{ name: string }> = ({ name }) => <span>{name}</span>;

const tableColumnDefinitions = [
  {
    id: 'drag',
    header: null,
    width: '45px',
    cell: (cell: PanelItem) => {
      return cell.type === 'asset' && <PanelAssetPropertyDragHandle item={cell} />;
    },
  },
  {
    id: 'variable',
    header: '',
    maxWidth: '100%',
    cell: (cell: PanelItem) => (cell.type === 'header' ? <Header name={cell.name} /> : <Property name={cell.name} />),
  },
];

const mapPanelAssetSummary =
  (assetId: string, assetName: string) =>
  (summary: PropertySummary | AlarmSummary): PanelDrag => ({
    type: 'asset',
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
      name: 'Asset Properties',
    });
    items.push(...properties.map(mapper));
  }

  if (alarms.length > 0) {
    items.push({
      type: 'header',
      name: 'Alarms',
    });
    items.push(...alarms.map(mapper));
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
