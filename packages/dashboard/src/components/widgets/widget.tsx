import React from 'react';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { DashboardMessages } from '../../messages';
import { DashboardConfiguration, Widget } from '../../types';
import { gestureable } from '../internalDashboard/determineTargetGestures';
import DynamicWidgetComponent from './dynamicWidget';
import { WidgetDropTarget } from './widgetDropTarget';

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
    <WidgetDropTarget widget={widget}>
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
    </WidgetDropTarget>
  );
};

export default WidgetComponent;
