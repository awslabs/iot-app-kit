import React from 'react';

import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';

import { ItemTypes } from './itemTypes';
import Widget from './components/widget';

import './index.css';

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

const CustomDragLayer: React.FC = () => {
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
        return <Widget componentTag={item.componentTag} />;
      default:
        return null;
    }
  };

  if (!isDragging) {
    return null;
  }
  return (
    <div className="custom-drag-layer">
      <div style={getItemStyles(initialOffset, currentOffset)}>{layer()}</div>
    </div>
  );
};

export default CustomDragLayer;
