import React, { useState } from 'react';
import {
  gestureable,
  idable,
} from '../internalDashboard/gestures/determineTargetGestures';
import DynamicWidgetComponent from './dynamicWidget';
import WidgetActions from './widgetActions';

import './widget.css';
import type { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import type { DashboardMessages } from '~/messages';
import type { DashboardWidget } from '~/types';

export type WidgetProps = {
  readOnly: boolean;
  query?: SiteWiseQuery;
  isSelected: boolean;
  cellSize: number;
  widget: DashboardWidget;
  messageOverrides: DashboardMessages;
};

/**
 *
 * Component used to position a widget on the dashboard and
 * mark it with the handles required to capture gestures
 *
 */
const WidgetComponent: React.FC<WidgetProps> = ({
  cellSize,
  widget,
  messageOverrides,
  isSelected,
  readOnly,
}) => {
  const { x, y, z, width, height } = widget;
  const [showActionButtons, setShowActionButtons] = useState(false);

  const handleShowActionButtons = (show: boolean) => {
    if (isSelected) {
      setShowActionButtons(false);
      return;
    }
    setShowActionButtons(show);
  };

  return (
    <div
      {...gestureable('widget')}
      {...idable(widget.id)}
      className={`widget ${readOnly ? 'widget-readonly' : 'widget-editable'}`}
      style={{
        ...(!z ? {} : { zIndex: z.toString() }),
        top: `${cellSize * y}px`,
        left: `${cellSize * x}px`,
        width: `${cellSize * width}px`,
        height: `${cellSize * height}px`,
      }}
      onMouseEnter={() => handleShowActionButtons(true)}
      onMouseLeave={() => handleShowActionButtons(false)}
    >
      {showActionButtons && <WidgetActions widget={widget} />}
      <DynamicWidgetComponent
        widget={widget}
        widgetsMessages={messageOverrides.widgets}
      />
    </div>
  );
};

export default WidgetComponent;
