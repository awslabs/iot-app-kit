import React, { type CSSProperties } from 'react';

import DynamicWidgetComponent, {
  getDragLayerProps,
} from '~/features/widgets/dynamicWidget';
import type { DashboardMessages } from '~/messages';
import { widgetCreator } from '~/store/dashboard/factory';
import { useDashboardCellSize } from '~/store/dashboard/use-dashboard-cell-size';
import { useDashboardHeight } from '~/store/dashboard/use-dashboard-height';
import { useDashboardWidth } from '~/store/dashboard/use-dashboard-width';
import './widget.css';

export type DragLayerWidgetProps = {
  componentTag: string;
  messageOverrides: DashboardMessages;
};

const DragLayerWidget: React.FC<DragLayerWidgetProps> = ({
  componentTag,
  messageOverrides,
}) => {
  const [dashboardHeight] = useDashboardHeight();
  const [dashboardWidth] = useDashboardWidth();
  const [dashboardCellSize] = useDashboardCellSize();

  const widgetPreset = widgetCreator({
    height: dashboardHeight,
    width: dashboardWidth,
    cellSize: dashboardCellSize,
  })(componentTag);

  const { width, height } = widgetPreset;

  const styles: CSSProperties = {
    width: dashboardCellSize * width + 'px',
    height: dashboardCellSize * height + 'px',
  };

  return (
    <div style={styles} className='drag-layer-widget'>
      <DynamicWidgetComponent
        {...getDragLayerProps({
          widget: widgetPreset,
          widgetsMessages: messageOverrides.widgets,
        })}
      />
    </div>
  );
};

export default DragLayerWidget;
