import React from 'react';

import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { DashboardMessages } from '~/messages';

import { DashboardConfiguration, Widget } from '~/types';
import { gestureable, idable } from '../internalDashboard/gestures/determineTargetGestures';
import DynamicWidgetComponent from './dynamicWidget';

import './widget.css';

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
      className={`widget ${readOnly ? 'widget-readonly' : ''}`}
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
