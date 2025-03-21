import { useState } from 'react';
import {
  gestureable,
  idable,
} from '../internalDashboard/gestures/determineTargetGestures';
import DynamicWidgetComponent from './dynamicWidget';
import WidgetActions from './widgetActions';
import type { DashboardMessages } from '~/messages';
import type { DashboardWidget } from '~/types';
import './widget.css';
import includes from 'lodash-es/includes';
import map from 'lodash-es/map';
import { useSelectedWidgetIds } from '~/hooks/useSelectedWidget';

export interface WidgetProps {
  readOnly: boolean;
  cellSize: number;
  widget: DashboardWidget;
  messageOverrides: DashboardMessages;
}

/**
 * Component used to position a widget on the dashboard and
 * mark it with the handles required to capture gestures
 */
const WidgetComponent: React.FC<WidgetProps> = ({
  cellSize,
  widget,
  messageOverrides,
  readOnly,
}) => {
  const selectedWidgetIds = useSelectedWidgetIds();
  const isSelected = (id: string) =>
    includes(
      map(selectedWidgetIds, (widgetId) => widgetId),
      id
    );
  const [showActionButtons, setShowActionButtons] = useState(false);

  const widgetActions = () => {
    if (selectedWidgetIds.length > 1) {
      return null;
    } else if (isSelected(widget.id)) {
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
        ...(!widget.z ? {} : { zIndex: widget.z.toString() }),
        top: `${cellSize * widget.y}px`,
        left: `${cellSize * widget.x}px`,
        width: `${cellSize * widget.width}px`,
        height: `${cellSize * widget.height}px`,
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
