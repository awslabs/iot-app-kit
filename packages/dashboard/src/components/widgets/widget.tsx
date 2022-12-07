import React from 'react';
import { DashboardMessages } from '../../messages';

import { DashboardConfiguration, Widget } from '../../types';
import { gestureable } from '../internalDashboard/determineTargetGestures';
import DynamicWidgetComponent from './dynamicWidget';

import './widget.css';

export type WidgetProps = {
  isSelected: boolean;
  cellSize: number;
  widget: Widget;
  viewport: DashboardConfiguration['viewport'];
  messageOverrides: DashboardMessages;
};

const WidgetComponent: React.FC<WidgetProps> = ({ cellSize, widget, viewport, messageOverrides }) => {
  const { id, x, y, z, width, height } = widget;

  const { invalidTagHeader, invalidTagSubheader } = messageOverrides.widgets;

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
      <DynamicWidgetComponent
        widgetId={id}
        viewport={viewport}
        invalidTagErrorHeader={invalidTagHeader}
        invalidTagErrorSubheader={invalidTagSubheader}
        {...widget}
      />
    </div>
  );
};

export default WidgetComponent;
