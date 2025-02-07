import { type CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import type { RegisteredWidgetType } from '~/features/widget-plugins/registry';
import type { DashboardState } from '~/store/state';
import create from '~/features/widget-instance/create';
import {
  DynamicWidgetComponent,
  getDragLayerProps,
} from '../../widgets/dynamicWidget';
import './widget.css';

export interface DragLayerWidgetProps {
  widgetType: RegisteredWidgetType;
}

export const DragLayerWidget = ({ widgetType }: DragLayerWidgetProps) => {
  const grid = useSelector((state: DashboardState) => state.grid);
  const widgetInstance = create(grid)(widgetType);
  const styles: CSSProperties = {
    width: grid.cellSize * widgetInstance.width + 'px',
    height: grid.cellSize * widgetInstance.height + 'px',
  };

  return (
    <div style={styles} className='drag-layer-widget'>
      <DynamicWidgetComponent
        {...getDragLayerProps({
          widget: widgetInstance,
        })}
      />
    </div>
  );
};
