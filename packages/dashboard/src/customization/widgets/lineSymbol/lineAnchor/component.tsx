import { type CSSProperties, useEffect, useRef } from 'react';
import { type XYCoord, useDrag } from 'react-dnd';
import { useGridSettings } from '~/components/actions/useGridSettings';
import './component.css';

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
 * Custom hook to handle drag-and-drop for LineWidget anchors.
 *
 * This hook initializes drag functionality and updates the widget position
 * whenever a drag event occurs on either anchor.
 *
 * @param {LineWidget} widget - The current LineWidget object that is being manipulated.
 * @param {'start'|'end'} anchorType - Specifies which anchor ('start' or 'end') is being dragged.
 * @return {ConnectDragSource} - A ref to be attached to the drag component.
 */
const useDragAndUpdate = (
  point: XYCoord,
  dimensions: { height: number; width: number },
  updateWidget: (point: XYCoord) => void
) => {
  const initialPointRef = useRef({
    x: 0,
    y: 0,
  });

  const { cellSize } = useGridSettings();

  const [{ diff, isDragging }, ref] = useDrag({
    type: 'LineAnchor',
    item: () => {
      initialPointRef.current = point;
      // we need to return an empty object at the minimum, even if no props are returned
      return {};
    },
    collect: (monitor) => {
      const offsetDifference = monitor.getDifferenceFromInitialOffset();
      return { diff: offsetDifference, isDragging: monitor.isDragging() };
    },
  });

  const diffDep = JSON.stringify(diff);
  useEffect(() => {
    if (isDragging && diff) {
      const newPoint = computeNewPosition(
        initialPointRef.current,
        diff,
        dimensions.height,
        dimensions.width,
        cellSize
      );
      updateWidget(newPoint);
    }
    // disabling because diff is stringified
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    diffDep,
    cellSize,
    dimensions.height,
    dimensions.width,
    isDragging,
    updateWidget,
  ]);
  return ref;
};

export const LineAnchor: React.FC<{
  style: CSSProperties;
  point: XYCoord;
  dimensions: { height: number; width: number };
  updateWidget: (point: XYCoord) => void;
}> = ({ style, point, dimensions, updateWidget }) => {
  const dragRef = useDragAndUpdate(point, dimensions, updateWidget);
  return (
    <div
      data-testid='line-anchor'
      ref={dragRef}
      style={style}
      className='line-anchor'
    />
  );
};
