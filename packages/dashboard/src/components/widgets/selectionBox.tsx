import React from 'react';
import SelectionBoxAnchor from './selectionBoxAnchor';
import { gestureable } from '../internalDashboard/gestures/determineTargetGestures';
import { getSelectionBox } from '~/util/getSelectionBox';

import './selectionBox.css';
import type { DashboardWidget } from '~/types';

export type SelectionBoxProps = {
  selectedWidgets: DashboardWidget[];
  cellSize: number;
  dragEnabled: boolean;
};

const SelectionBox: React.FC<SelectionBoxProps> = ({ selectedWidgets, cellSize, dragEnabled }) => {
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
          zIndex: -1,
        }}
      ></div>
      <div
        className={`selection-box ${!dragEnabled ? 'selection-box-disabled' : ''}`}
        style={{
          top: `${cellSize * y}px`,
          left: `${cellSize * x}px`,
          width: `${cellSize * width}px`,
          height: `${cellSize * height}px`,
          zIndex: 1,
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

export default SelectionBox;
