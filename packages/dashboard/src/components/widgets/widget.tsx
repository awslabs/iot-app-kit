import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import React from 'react';
import { DashboardMessages } from '../../messages';

import { DashboardConfiguration, Widget } from '../../types';
import { gestureable } from '../internalDashboard/determineTargetGestures';
import DynamicWidgetComponent from './dynamicWidget';

import './widget.css';

export type WidgetProps = {
  query?: SiteWiseQuery;
  isSelected: boolean;
  cellSize: number;
  widget: Widget;
  viewport: DashboardConfiguration['viewport'];
  messageOverrides: DashboardMessages;
};

const WidgetComponent: React.FC<WidgetProps> = ({ cellSize, widget, viewport, messageOverrides, query }) => {
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
        width: `${cellSize * width}px`,
        height: `${cellSize * height}px`,
      }}
    >
      <DynamicWidgetComponent
        query={query}
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
