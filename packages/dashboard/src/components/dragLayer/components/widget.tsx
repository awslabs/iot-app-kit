import React, { CSSProperties } from 'react';

import { ComponentTag } from '../../../types';
import DynamicWidgetComponent, { getDragLayerProps } from '../../widgets/dynamicWidget';

import { DashboardState } from '../../../store/state';
import { useSelector } from 'react-redux';
import { widgetCreator } from '../../../store/actions/createWidget/presets';

import './widget.css';
import { DashboardMessages } from '../../../messages';

export type DragLayerWidgetProps = {
  componentTag: ComponentTag;
  messageOverrides: DashboardMessages;
};

const DragLayerWidget: React.FC<DragLayerWidgetProps> = ({ componentTag, messageOverrides }) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
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
        {...getDragLayerProps({ widget: widgetPreset, viewport, widgetsMessages: messageOverrides.widgets })}
      />
    </div>
  );
};

export default DragLayerWidget;
