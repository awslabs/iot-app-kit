import React from 'react';

import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';

import { ItemTypes } from './itemTypes';
import Widget from './components/widget';

import './index.css';
import { DashboardMessages } from '~/messages';

import { ResourceExplorerPanelAssetPropertyDragGhost } from '../resourceExplorer/components/panel';

const getItemStyles = (initialOffset: XYCoord | null, currentOffset: XYCoord | null) => {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  const { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
};

export type CustomDragLayerProps = {
  messageOverrides: DashboardMessages;
};

const CustomDragLayer: React.FC<CustomDragLayerProps> = ({ messageOverrides }) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => {
    return {
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    };
  });

  const layer = () => {
    switch (itemType) {
      case ItemTypes.Component:
        return <Widget componentTag={item.componentTag} messageOverrides={messageOverrides} />;
      case ItemTypes.ResourceExplorerAssetProperty:
        return <ResourceExplorerPanelAssetPropertyDragGhost item={item} />;
      default:
        return null;
    }
  };

  if (!isDragging) {
    return null;
  }
  return (
    <div className='custom-drag-layer'>
      <div style={getItemStyles(initialOffset, currentOffset)}>{layer()}</div>
    </div>
  );
};

export default CustomDragLayer;
