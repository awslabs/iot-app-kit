import { useEffect } from 'react';
import { useDragLayer, type XYCoord } from 'react-dnd';
import { DragLayerWidget } from './components/widget';
import { ItemTypes } from './itemTypes';
import './index.css';

const getItemStyles = (
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) => {
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

export interface CustomDragLayerProps {
  onDrag: (isDragging: boolean) => void;
}

export const CustomDragLayer = ({ onDrag }: CustomDragLayerProps) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => {
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
  }, [isDragging, onDrag]);

  const layer = () => {
    switch (itemType) {
      case ItemTypes.Component:
        return <DragLayerWidget widgetType={item.componentTag} />;
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
