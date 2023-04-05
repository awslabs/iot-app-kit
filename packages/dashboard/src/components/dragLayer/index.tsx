import React, { useEffect } from 'react';

import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';

import { ItemTypes } from './itemTypes';
import DashboardWidget from './components/widget';

import './index.css';
import { ResourceExplorerPanelAssetPropertyDragGhost } from '../resourceExplorer/components/panel';
import { DefaultDashboardMessages } from '~/messages';

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
  onDrag: (isDragging: boolean) => void;
};

const CustomDragLayer: React.FC<CustomDragLayerProps> = ({ onDrag }) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => {
    return {
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    };
  });

  useEffect(() => {
    onDrag(isDragging);
  }, [isDragging]);

  const layer = () => {
    switch (itemType) {
      case ItemTypes.Component:
        return <DashboardWidget componentTag={item.componentTag} messageOverrides={DefaultDashboardMessages} />;
      case ItemTypes.ResourceExplorerAssetProperty:
      case ItemTypes.ResourceExplorerAlarm:
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
