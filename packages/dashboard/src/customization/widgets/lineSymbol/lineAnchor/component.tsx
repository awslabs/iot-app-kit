import React, { CSSProperties, useEffect, useRef } from 'react';
import './component.css';
import { LineWidget } from '~/customization/widgets/types';
import { XYCoord, useDrag } from 'react-dnd';
import { DashboardWidget } from '~/types';
import { useGridSettings } from '~/components/actions/useGridSettings';
import { useWidgetActions } from '~/customization/hooks/useWidgetActions';

/**
 * Compute the new position of the widget based on initial position, offset difference, and grid settings.
 *
 * @param {XYCoord} initialPosition - The initial position of the widget.
 * @param {XYCoord} offsetDifference - The offset difference based on the drag event.
 * @param {number} height - The height of the widget.
 * @param {number} width - The width of the widget.
 * @param {number} cellSize - The size of a cell in the grid.
 * @return {XYCoord} - The new position (x, y) for the widget.
 */
const computeNewPosition = (
  initialPosition: XYCoord,
  offsetDifference: XYCoord,
  height: number,
  width: number,
  cellSize: number
): XYCoord => {
  const { x: initialX, y: initialY } = initialPosition;
  const { x: offsetX, y: offsetY } = offsetDifference;

  const widthPixels = Math.round(width * cellSize);
  const heightPixels = Math.round(height * cellSize);

  const newX = Math.max(0, Math.min(initialX + offsetX, widthPixels));
  const newY = Math.max(0, Math.min(initialY + offsetY, heightPixels));

  return { x: newX, y: newY };
};

/**
 * Generate an updated widget based on the provided properties and drag data.
 *
 * @param {LineWidget} widget - The current widget object.
 * @param {'start'|'end'} anchorType - Specifies which anchor ('start' or 'end') is being dragged.
 * @param {XYCoord} initialPoint - The initial position of the dragged anchor.
 * @param {XYCoord} diff - The offset difference based on the drag event.
 * @param {number} cellSize - The size of a cell in the grid.
 * @return {DashboardWidget} - The updated widget object.
 */
const getUpdatedWidget = (
  widget: LineWidget,
  anchorType: 'start' | 'end',
  initialPoint: XYCoord,
  diff: XYCoord,
  cellSize: number
): DashboardWidget => {
  const { x, y } = computeNewPosition(initialPoint, diff, widget.height, widget.width, cellSize);
  const updatedProperties = {
    ...widget.properties,
    [anchorType]: {
      x,
      y,
    },
  };

  return {
    ...widget,
    properties: updatedProperties,
  };
};

/**
 * Custom hook to handle drag-and-drop for LineWidget anchors.
 *
 * This hook initializes drag functionality and updates the widget position
 * whenever a drag event occurs on either anchor.
 *
 * @param {LineWidget} widget - The current LineWidget object that is being manipulated.
 * @param {'start'|'end'} anchorType - Specifies which anchor ('start' or 'end') is being dragged.
 * @return {ConnectDragSource} - A ref to be attached to the drag component.
 */
const useDragAndUpdate = (widget: LineWidget, anchorType: 'start' | 'end') => {
  const { update: updateWidget } = useWidgetActions<DashboardWidget>();
  const initialStartPointRef = useRef({
    x: 0,
    y: 0,
  });
  const initialEndPointRef = useRef({
    x: 0,
    y: 0,
  });

  const { cellSize } = useGridSettings();

  const [{ diff, isDragging }, ref] = useDrag({
    type: 'LineAnchor',
    item: () => {
      initialStartPointRef.current = {
        x: widget.properties.start.x,
        y: widget.properties.start.y,
      };
      initialEndPointRef.current = {
        x: widget.properties.end.x,
        y: widget.properties.end.y,
      };
      return {
        anchorType,
      };
    },
    collect: (monitor) => {
      const offsetDifference = monitor.getDifferenceFromInitialOffset();
      return { diff: offsetDifference, isDragging: monitor.isDragging() };
    },
  });

  useEffect(() => {
    if (isDragging && diff) {
      const initialPoint = anchorType === 'start' ? initialStartPointRef.current : initialEndPointRef.current;
      const updatedWidget = getUpdatedWidget(widget, anchorType, initialPoint, diff, cellSize);
      updateWidget(updatedWidget);
    }
  }, [diff?.x, diff?.y]);
  return ref;
};

export const LineAnchor: React.FC<{
  style: CSSProperties;
  anchorType: 'start' | 'end';
  widget: LineWidget;
}> = ({ style, anchorType, widget }) => {
  const dragRef = useDragAndUpdate(widget, anchorType);
  return (
    <div
      id='line-symbol-widget'
      data-testid={'line-' + anchorType + '-anchor'}
      ref={dragRef}
      style={style}
      className='line-anchor'
    />
  );
};
