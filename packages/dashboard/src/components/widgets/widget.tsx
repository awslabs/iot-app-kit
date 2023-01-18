import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import React from 'react';
import { DashboardMessages } from '../../messages';

import { DashboardConfiguration, Widget } from '../../types';
import { gestureable } from '../internalDashboard/determineTargetGestures';
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

const WidgetComponent: React.FC<WidgetProps> = ({
  cellSize,
  widget,
  viewport,
  messageOverrides,
  query,
  readOnly,
  isSelected,
}) => {
  const { x, y, z, width, height } = widget;

  return (
    <div
      {...gestureable('widget')}
      className={`widget ${readOnly ? 'widget-readonly' : ''}`}
      style={{
        zIndex: z.toString(),
        top: `${cellSize * y}px`,
        left: `${cellSize * x}px`,
        width: `${cellSize * width}px`,
        height: `${cellSize * height}px`,
      }}
    >
      <DynamicWidgetComponent
        readOnly={readOnly}
        query={query}
        viewport={viewport}
        widget={widget}
        isSelected={isSelected}
        widgetsMessages={messageOverrides.widgets}
      />
    </div>
  );
};

export default WidgetComponent;
