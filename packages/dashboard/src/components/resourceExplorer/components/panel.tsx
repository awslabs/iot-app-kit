import React from 'react';
import { useDrag, ConnectDragSource, ConnectDragPreview } from 'react-dnd';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import Link from '@cloudscape-design/components/link';
import { ItemTypes } from '../../dragLayer/itemTypes';
import { ExtendedPanelAssetSummary, isAlarm } from '..';

import './style.css';
import { DashboardMessages } from '../../../messages';

export const ResourceExplorerPanelAssetPropertyDragGhost = ({ item }: { item: ExtendedPanelAssetSummary }) => {
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

const PanelAssetPropertyDragHandle = ({ item }: { item: ExtendedPanelAssetSummary }) => {
  const [collected, dragSource, dragPreview]: [any, ConnectDragSource, ConnectDragPreview] = useDrag(() => ({
    type: ItemTypes.ResourceExplorerAssetProperty,
    item,
  }));

  return collected.isDragging ? (
    <div className='resource-explorer-panel-asset-property-drag-handle-dragging' ref={dragPreview}>
      <Icon name='expand' /> <span>{item.name}</span>
    </div>
  ) : (
    <div className='resource-explorer-panel-asset-property-drag-handle' ref={dragSource} {...collected}>
      <Icon name='expand' />
    </div>
  );
};

export interface ResourceExplorerPanelProps {
  panelItems: ExtendedPanelAssetSummary[];
  alarms?: ExtendedPanelAssetSummary[];
  handlePanelItemClick: (item: ExtendedPanelAssetSummary) => void;
  messageOverrides: DashboardMessages;
}

export const ResourceExplorerPanel: React.FC<ResourceExplorerPanelProps> = ({
  panelItems,
  alarms,
  handlePanelItemClick,
  messageOverrides,
}) => {
  const handlePanelItemClickInner = (e: Event, item: ExtendedPanelAssetSummary) => {
    e.preventDefault();
    handlePanelItemClick(item);
  };

  const PanelCell = ({ item }: { item: ExtendedPanelAssetSummary }) => {
    if (item?.isHeader) {
      return <Box variant='awsui-key-label'>{item?.name || ''}</Box>;
    }

    if (isAlarm(item) || item?.isAssetProperty) {
      return <span>{item?.name || ''}</span>;
    }

    return (
      <Link href='#' onFollow={(e) => handlePanelItemClickInner(e, item)}>
        {item?.name || ''}
      </Link>
    );
  };

  const tableColumnDefinitions = [
    {
      id: 'drag',
      header: null,
      width: '45px',
      cell: (item: ExtendedPanelAssetSummary) =>
        (item?.isAssetProperty || isAlarm(item)) && <PanelAssetPropertyDragHandle item={item} />,
    },
    {
      id: 'variable',
      header: '',
      maxWidth: '100%',
      cell: (item: ExtendedPanelAssetSummary) => <PanelCell item={item} />,
    },
  ];

  return (
    <Table
      variant='embedded'
      columnDefinitions={tableColumnDefinitions}
      items={[...panelItems, ...(alarms || [])] || []}
      trackBy='name'
      empty={<PanelEmpty messageOverrides={messageOverrides} />}
    />
  );
};
