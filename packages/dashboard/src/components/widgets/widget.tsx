import React from 'react';
import { gestureable, idable } from '../internalDashboard/gestures/determineTargetGestures';
import DynamicWidgetComponent from './dynamicWidget';

import './widget.css';
import type { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import type { DashboardMessages } from '~/messages';
import type { DashboardConfiguration, Widget } from '~/types';

export type WidgetProps = {
  readOnly: boolean;
  query?: SiteWiseQuery;
  isSelected: boolean;
  cellSize: number;
  widget: Widget;
  viewport: DashboardConfiguration['viewport'];
  messageOverrides: DashboardMessages;
};

/**
 *
 * Component used to position a widget on the dashboard and
 * mark it with the handles required to capture gestures
 *
 */
const WidgetComponent: React.FC<WidgetProps> = ({ cellSize, widget, messageOverrides, readOnly }) => {
  const { x, y, z, width, height } = widget;

  return (
    <div
      {...gestureable('widget')}
      {...idable(widget.id)}
      className={`widget ${readOnly ? 'widget-readonly' : 'widget-editable'}`}
      style={{
        zIndex: z.toString(),
        top: `${cellSize * y}px`,
        left: `${cellSize * x}px`,
        width: `${cellSize * width}px`,
        height: `${cellSize * height}px`,
      }}
    >
      <DynamicWidgetComponent widget={widget} widgetsMessages={messageOverrides.widgets} />
    </div>
  );
};

export default WidgetComponent;
