import React from 'react';

import DynamicWidgetComponent, {
  getDragLayerProps,
} from '../../widgets/dynamicWidget';
import { useSelector } from 'react-redux';
import { widgetCreator } from '~/store/actions/createWidget/presets';

import './widget.css';
import type { CSSProperties } from 'react';
import type { DashboardState } from '~/store/state';
import type { DashboardMessages } from '~/messages';

export type DragLayerWidgetProps = {
  componentTag: string;
  messageOverrides: DashboardMessages;
};

const DragLayerWidget: React.FC<DragLayerWidgetProps> = ({
  componentTag,
  messageOverrides,
}) => {
  const grid = useSelector((state: DashboardState) => state.grid);

  const widgetPreset = widgetCreator(grid)(componentTag);

  const { width, height } = widgetPreset;

  const styles: CSSProperties = {
    width: grid.cellSize * width + 'px',
    height: grid.cellSize * height + 'px',
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
