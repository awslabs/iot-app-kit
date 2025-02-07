import type { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { useCallback, useMemo, useState } from 'react';
import type { RegisteredWidgetType } from '~/features/widget-plugins/registry';
import {
  gestureable,
  idable,
} from '../internalDashboard/gestures/determineTargetGestures';
import { DynamicWidgetComponent } from './dynamicWidget';
import { WidgetActions } from './widgetActions';
import './widget.css';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface WidgetProps<WidgetType extends RegisteredWidgetType> {
  readOnly: boolean;
  query?: SiteWiseQuery;
  isSelected: boolean;
  numSelected: number;
  cellSize: number;
  widget: WidgetInstance<WidgetType>;
}

/**
 * Component used to position a widget on the dashboard and
 * mark it with the handles required to capture gestures
 */
export const WidgetComponent = <WidgetType extends RegisteredWidgetType>({
  cellSize,
  widget,
  isSelected,
  numSelected,
  readOnly,
}: WidgetProps<WidgetType>) => {
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

  const style = useMemo(
    () => ({
      ...(!widget.z ? {} : { zIndex: widget.z.toString() }),
      top: `${cellSize * widget.y}px`,
      left: `${cellSize * widget.x}px`,
      width: `${cellSize * widget.width}px`,
      height: `${cellSize * widget.height}px`,
    }),
    [widget.z, widget.y, widget.x, widget.width, widget.height, cellSize]
  );

  const showActions = useCallback(() => setShowActionButtons(true), []);
  const hideActions = useCallback(() => setShowActionButtons(false), []);

  return (
    <div
      {...gestureable('widget')}
      {...idable(widget.id)}
      className={`widget ${readOnly ? 'widget-readonly' : 'widget-editable'}`}
      style={style}
      onMouseEnter={showActions}
      onMouseLeave={hideActions}
    >
      {widgetActions()}
      <DynamicWidgetComponent widget={widget} />
    </div>
  );
};
