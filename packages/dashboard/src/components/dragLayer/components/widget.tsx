import React, { CSSProperties } from 'react';
import { nanoid } from '@reduxjs/toolkit';

import { ComponentTag } from '../../../types';
import DynamicWidgetComponent from '../../widgets/dynamicWidget';

import { DashboardState } from '../../../store/state';
import { useSelector } from 'react-redux';
import { widgetCreator } from '../../../store/actions/createWidget/presets';

import './widget.css';

export type DragLayerWidgetProps = {
  componentTag: ComponentTag;
};

const DragLayerWidget: React.FC<DragLayerWidgetProps> = ({ componentTag }) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
  const grid = useSelector((state: DashboardState) => state.grid);

  const widgetPreset = widgetCreator(grid)(componentTag);

  const { width, height } = widgetPreset;

  const styles: CSSProperties = {
    width: grid.cellSize * width + 'px',
    height: grid.cellSize * height + 'px',
  };

  return (
    <div style={styles} className="drag-layer-widget">
      <DynamicWidgetComponent
        componentTag={componentTag}
        widgetId={nanoid()}
        assets={[]}
        viewport={viewport}
        invalidTagErrorHeader={''}
        invalidTagErrorSubheader={''}
        gestures={false}
      />
    </div>
  );
};

export default DragLayerWidget;
