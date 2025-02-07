import { getSelectionBox } from '~/util/getSelectionBox';
import { gestureable } from '../internalDashboard/gestures/determineTargetGestures';
import { useLayers } from '../internalDashboard/useLayers';
import { SelectionBoxAnchor } from './selectionBoxAnchor';
import './selectionBox.css';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface SelectionBoxProps {
  selectedWidgets: WidgetInstance[];
  cellSize: number;
  dragEnabled: boolean;
}

export const SelectionBox = ({
  selectedWidgets,
  cellSize,
  dragEnabled,
}: SelectionBoxProps) => {
  const { selectionBoxLayer, selectionGestureLayer } = useLayers();

  const rect = getSelectionBox(selectedWidgets);
  if (!rect) return null;
  const { x, y, height, width } = rect;

  return (
    <>
      <div
        className='selection-box-handle'
        {...gestureable('selection')}
        style={{
          position: 'absolute',
          top: `${cellSize * y - 2}px`,
          left: `${cellSize * x - 2}px`,
          width: `${cellSize * width + 4}px`,
          height: `${cellSize * height + 4}px`,
          zIndex: selectionGestureLayer,
        }}
      ></div>
      <div
        className={`selection-box ${
          !dragEnabled ? 'selection-box-disabled' : ''
        }`}
        style={{
          top: `${cellSize * y}px`,
          left: `${cellSize * x}px`,
          width: `${cellSize * width}px`,
          height: `${cellSize * height}px`,
          zIndex: selectionBoxLayer,
        }}
      >
        <SelectionBoxAnchor anchor='top' />
        <SelectionBoxAnchor anchor='bottom' />
        <SelectionBoxAnchor anchor='right' />
        <SelectionBoxAnchor anchor='left' />
        <SelectionBoxAnchor anchor='top-right' />
        <SelectionBoxAnchor anchor='top-left' />
        <SelectionBoxAnchor anchor='bottom-right' />
        <SelectionBoxAnchor anchor='bottom-left' />
      </div>
    </>
  );
};
