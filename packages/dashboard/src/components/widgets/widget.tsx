import React from 'react';

import { DashboardConfiguration, Widget } from '../../types';
import { gestureable } from '../internalDashboard/determineTargetGestures';

import './widget.css';

export type WidgetProps = {
  isSelected: boolean;
  cellSize: number;
  widget: Widget;
  viewport: DashboardConfiguration['viewport'];
};

const WidgetComponent: React.FC<WidgetProps> = ({ cellSize, widget }) => {
  const { x, y, z, width, height, componentTag } = widget;

  return (
    <div
      {...gestureable('widget')}
      className="widget"
      style={{
        zIndex: z.toString(),
        top: `${cellSize * y}px`,
        left: `${cellSize * x}px`,
        width: `${cellSize * (width - 1)}px`,
        height: `${cellSize * (height - 1)}px`,
      }}
    >
      <div>{componentTag}</div>
    </div>
  );
};

export default WidgetComponent;
