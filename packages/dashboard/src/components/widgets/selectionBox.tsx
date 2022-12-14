import React from 'react';
import { Widget } from '../../types';
import SelectionBoxAnchor from './selectionBoxAnchor';

import './selectionBox.css';
import { gestureable } from '../internalDashboard/determineTargetGestures';
import { getSelectionBox } from '../../util/getSelectionBox';

export type SelectionBoxProps = {
  selectedWidgets: Widget[];
  cellSize: number;
};

const SelectionBox: React.FC<SelectionBoxProps> = ({ selectedWidgets, cellSize }) => {
  const rect = getSelectionBox(selectedWidgets);

  if (!rect) return null;

  const { x, y, height, width } = rect;

  return (
    <div
      {...gestureable('selection')}
      className="selection-box"
      style={{
        top: `${cellSize * y}px`,
        left: `${cellSize * x}px`,
        width: `${cellSize * width}px`,
        height: `${cellSize * height}px`,
      }}
    >
      <SelectionBoxAnchor anchor="top" />
      <SelectionBoxAnchor anchor="bottom" />
      <SelectionBoxAnchor anchor="right" />
      <SelectionBoxAnchor anchor="left" />
      <SelectionBoxAnchor anchor="top-right" />
      <SelectionBoxAnchor anchor="top-left" />
      <SelectionBoxAnchor anchor="bottom-right" />
      <SelectionBoxAnchor anchor="bottom-left" />
    </div>
  );
};

export default SelectionBox;
