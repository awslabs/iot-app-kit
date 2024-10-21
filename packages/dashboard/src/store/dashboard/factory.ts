import { nanoid } from '@reduxjs/toolkit';
import { WidgetPropertiesGeneratorMap } from '~/customization/widgetPropertiesGeneratorMap';
import type { DashboardWidget } from '~/types';

const BASE_POSITION = {
  x: 0,
  y: 0,
  z: 0,
};

export const widgetCreator =
  (dashboardDimensions: { cellSize: number; height: number; width: number }) =>
  (type: string): DashboardWidget => {
    const { properties, initialSize } = WidgetPropertiesGeneratorMap[type];

    const { width: widgetPixelWidth, height: widgetPixelHeight } =
      initialSize || { height: 150, width: 150 };

    const preset = {
      id: nanoid(),
      type,
      width: Math.min(
        Math.ceil(widgetPixelWidth / dashboardDimensions.cellSize),
        dashboardDimensions.width
      ),
      height: Math.min(
        Math.ceil(widgetPixelHeight / dashboardDimensions.cellSize),
        dashboardDimensions.height
      ),
      ...BASE_POSITION,
      properties: (properties && properties()) || {},
    };

    return preset;
  };
