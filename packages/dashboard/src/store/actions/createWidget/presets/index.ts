import { nanoid } from '@reduxjs/toolkit';
import { Widget } from '~/types';
import { DashboardState } from '~/store/state';
import { WidgetPropertiesGeneratorMap } from '~/customization/widgetPropertiesGeneratorMap';

const BASE_POSITION = {
  x: 0,
  y: 0,
  z: 0,
};

export const widgetCreator =
  (gridState: DashboardState['grid']) =>
  (type: string): Widget => {
    const { width, height, cellSize } = gridState;

    const { properties, initialSize } = WidgetPropertiesGeneratorMap[type];

    const { width: widgetPixelWidth, height: widgetPixelHeight } = initialSize || { height: 150, width: 150 };

    const preset = {
      id: nanoid(),
      type,
      width: Math.min(Math.ceil(widgetPixelWidth / cellSize), width),
      height: Math.min(Math.ceil(widgetPixelHeight / cellSize), height),
      ...BASE_POSITION,
      properties: (properties && properties()) || {},
    };

    return preset;
  };
