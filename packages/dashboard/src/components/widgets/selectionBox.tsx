import React from 'react';
import { DashboardConfiguration, Rect, Widget } from '../../types';
import { isDefined } from '../../util/isDefined';
import SelectionBoxAnchor from './selectionBoxAnchor';

import './selectionBox.css';
import { gestureable } from '../internalDashboard/determineTargetGestures';

// Returns the smallest rectangle which can contain all the selected widgets
export const getSelectionBox = ({
  selectedWidgetIds,
  dashboardConfiguration,
}: {
  selectedWidgetIds: string[];
  dashboardConfiguration: DashboardConfiguration;
}): Rect | null => {
  const widgets = selectedWidgetIds
    .map((widgetId) => dashboardConfiguration.widgets.find((widget) => widget.id === widgetId))
    .filter(isDefined);

  if (widgets.length === 0) {
    return null;
  }

  const minX = Math.min(...widgets.map((widget) => widget.x));
  const maxX = Math.max(...widgets.map((widget) => widget.x + widget.width));
  const minY = Math.min(...widgets.map((widget) => widget.y));
  const maxY = Math.max(...widgets.map((widget) => widget.y + widget.height));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

export type SelectionBoxProps = {
  dashboardConfiguration: DashboardConfiguration;
  selectedWidgets: Widget[];
  cellSize: number;
};

const SelectionBox: React.FC<SelectionBoxProps> = ({ dashboardConfiguration, selectedWidgets, cellSize }) => {
  const rect = getSelectionBox({ selectedWidgetIds: selectedWidgets.map((w) => w.id), dashboardConfiguration });
  if (!rect) return null;

  const { x, y, height, width } = rect;

  return (
    <div
      {...gestureable('selection')}
      className="selection-box"
      style={{
        top: `${cellSize * y}px`,
        left: `${cellSize * x}px`,
        width: `${cellSize * (width - 1)}px`,
        height: `${cellSize * (height - 1)}px`,
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
