import { useState } from 'react';
import {
  gestureable,
  idable,
} from '../internalDashboard/gestures/determineTargetGestures';
import DynamicWidgetComponent from './dynamicWidget';
import WidgetActions from './widgetActions';

import type { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import type { DashboardMessages } from '~/messages';
import type { DashboardWidget } from '~/types';
import './widget.css';

export type WidgetProps = {
  readOnly: boolean;
  query?: SiteWiseQuery;
  isSelected: boolean;
  numSelected: number;
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
  numSelected,
  readOnly,
}) => {
  const { x, y, z, width, height } = widget;
  const [showActionButtons, setShowActionButtons] = useState(false);

  const widgetActions = () => {
    if (numSelected > 1) {
      return null;
    } else if (isSelected) {
      return <WidgetActions widget={widget} />;
    } else {
      return showActionButtons ? <WidgetActions widget={widget} /> : null;
    }
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
      onMouseEnter={() => setShowActionButtons(true)}
      onMouseLeave={() => setShowActionButtons(false)}
    >
      {widgetActions()}
      <DynamicWidgetComponent
        widget={widget}
        widgetsMessages={messageOverrides.widgets}
      />
    </div>
  );
};

export default WidgetComponent;
