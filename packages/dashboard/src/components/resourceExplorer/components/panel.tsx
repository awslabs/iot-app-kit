import React from 'react';
import { useDrag, ConnectDragSource, ConnectDragPreview } from 'react-dnd';
import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import Link from '@cloudscape-design/components/link';
import { Table } from '@cloudscape-design/components';
import { ItemTypes } from '../../dragLayer/itemTypes';
import { ExtendedPanelAssetSummary } from '..';

import './style.css';
import { DashboardMessages } from '../../../messages';
import { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';

export const ResourceExplorerPanelAssetPropertyDragGhost = ({ item }: { item: ExtendedPanelAssetSummary }) => {
  return (
    <div className="resource-explorer-panel-asset-property-drag-ghost">
      <Icon name="expand" />{' '}
      <Box variant="awsui-key-label">
        {item.alias || 'Unaliased'} | {item.name}
      </Box>
    </div>
  );
};

const PanelEmpty = ({ messageOverrides }: { messageOverrides: DashboardMessages }) => (
  <Box textAlign="center" padding={{ bottom: 's' }} variant="p" color="inherit">
    {messageOverrides.resourceExplorer.panelEmptyLabel}
  </Box>
);

const PanelAssetProperty = ({ item }: { item: ExtendedPanelAssetSummary }) => (
  <>
    <div className="resource-explorer-panel-drag-icon">
      <Icon name="expand" />
    </div>
    <span>
      {item.alias || 'Unaliased'} | {item.name}
    </span>
  </>
);

const PanelAssetPropertyDragHandle = ({ item, asset }: { item: ExtendedPanelAssetSummary }) => {
  const [collected, dragSource, dragPreview]: [any, ConnectDragSource, ConnectDragPreview] = useDrag(() => ({
    type: ItemTypes.ResourceExplorerAssetProperty,
    item: {
      item,
      asset,
    },
  }));

  return collected.isDragging ? (
    <div className="resource-explorer-panel-asset-property-drag-handle-dragging" ref={dragPreview}>
      <PanelAssetProperty item={item} />
    </div>
  ) : (
    <div className="resource-explorer-panel-asset-property-drag-handle" ref={dragSource} {...collected}>
      <PanelAssetProperty item={item} />
    </div>
  );
};

const PanelAlarm = ({ item /*, asset */ }: { item: ExtendedPanelAssetSummary; asset: any }) => (
  <>
    <div className="resource-explorer-panel-drag-icon">
      <Icon name="expand" />
    </div>
    <span>
      <Icon name="status-pending" variant="subtle" /> {item.name}
      {/* {asset?.id} */}
      {/* {item?.properties?.find((p) => p?.name === 'AWS/ALARM_STATE').id} */}
    </span>
  </>
);

const PanelAlarmDragHandle = ({ item, asset }: { item: ExtendedPanelAssetSummary; asset: any }) => {
  // const [collected, dragSource, dragPreview]: [any, ConnectDragSource, ConnectDragPreview] = useDrag(() => ({
  //   type: ItemTypes.ResourceExplorerAlarm,
  //   item,
  // }));

  // return collected.isDragging ? (
  //   <div className="resource-explorer-panel-asset-property-drag-handle-dragging" ref={dragPreview}>
  //     <PanelAlarm item={item} asset={asset} />
  //   </div>
  // ) : (
  //   <div className="resource-explorer-panel-asset-property-drag-handle" ref={dragSource} {...collected}>
  //     <PanelAlarm item={item} asset={asset} />
  //   </div>
  // );
  return (
    <div className="resource-explorer-panel-asset-property-drag-handle">
      <PanelAlarm item={item} asset={asset} />
    </div>
  );
  // );
};

interface DescribeAssetResponseWithChildAssets extends DescribeAssetResponse {
  children: ExtendedPanelAssetSummary[];
}

export interface IotResourceExplorerPanelProps {
  panelItems: ExtendedPanelAssetSummary[];
  handlePanelItemClick: (item: ExtendedPanelAssetSummary) => void;
  messageOverrides: DashboardMessages;
  asset: DescribeAssetResponseWithChildAssets | null;
}

export const IotResourceExplorerPanel: React.FC<IotResourceExplorerPanelProps> = ({
  handlePanelItemClick,
  asset,
  messageOverrides,
}) => {
  const handlePanelItemClickInner = (e: Event, item: ExtendedPanelAssetSummary) => {
    e.preventDefault();
    handlePanelItemClick(item);
  };

  const childAssets = asset?.children?.length ? asset?.children || [] : [];
  const assetProperties = asset?.assetProperties?.length ? asset?.assetProperties || [] : [];
  const alarms = asset?.assetCompositeModels?.filter(({ type }) => type === 'AWS/ALARM') || [];

  const panelItems = [...childAssets, ...assetProperties, ...alarms];

  const PanelCell = ({ item }: { item: any }) => {
    const isHeader = item?.isHeader;
    const isAsset = !!item?.hierarchies;
    const isAssetProperty = !!item?.notification;
    const isAlarm = !!(item?.type === 'AWS/ALARM');

    if (isHeader) return <Box variant="awsui-key-label">{item.name}</Box>;

    if (isAsset)
      return (
        <Link href="#" onFollow={(e) => handlePanelItemClickInner(e, item)}>
          {item.name}
        </Link>
      );

    if (isAssetProperty) return <PanelAssetPropertyDragHandle item={item} asset={asset} />;

    if (isAlarm) return <PanelAlarmDragHandle item={item} asset={asset} />;

    return <></>;
  };

  const tableColumnDefinitions = [
    {
      id: 'variable',
      header: '',
      maxWidth: '100%',
      cell: (item: ExtendedPanelAssetSummary) => <PanelCell item={item} />,
    },
  ];

  return (
    <Table
      variant="embedded"
      columnDefinitions={tableColumnDefinitions}
      items={panelItems || []}
      trackBy="name"
      empty={<PanelEmpty messageOverrides={messageOverrides} />}
    />
  );
};
