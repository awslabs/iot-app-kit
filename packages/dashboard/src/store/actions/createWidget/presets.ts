import { nanoid } from '@reduxjs/toolkit';
import { ComponentTag, Widget } from '../../../types';
import { DashboardState } from '../../state';

/**
 * Because the dashboard grid variables can change, these presets are defined in real pixel sizes.
 * They are the minimum height and width that look good for each widget when shown with an empty query set.
 */
export const WidgetSizePresets: { [key in ComponentTag]: Pick<Widget, 'width' | 'height'> } = {
  'iot-bar-chart': {
    height: 150,
    width: 270,
  },
  'iot-kpi': {
    height: 120,
    width: 270,
  },
  'iot-line-chart': {
    height: 150,
    width: 270,
  },
  'iot-scatter-chart': {
    height: 150,
    width: 270,
  },
  'iot-status-grid': {
    height: 180,
    width: 270,
  },
  'iot-status-timeline': {
    height: 170,
    width: 270,
  },
  'iot-table': {
    height: 170,
    width: 270,
  },
};

export const widgetCreator =
  (gridState: DashboardState['grid']) =>
  (componentTag: ComponentTag): Pick<Widget, 'id' | 'componentTag' | 'width' | 'height'> => {
    const { width, height, cellSize } = gridState;

    const { width: widgetPixelWidth, height: widgetPixelHeight } = WidgetSizePresets[componentTag];

    const preset = {
      id: nanoid(),
      componentTag,
      width: Math.min(Math.ceil(widgetPixelWidth / cellSize), width),
      height: Math.min(Math.ceil(widgetPixelHeight / cellSize), height),
    };

    return preset;
  };
