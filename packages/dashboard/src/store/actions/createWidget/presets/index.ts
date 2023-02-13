import { nanoid } from '@reduxjs/toolkit';
import { ComponentTag, Widget, AppKitComponentTag, AppKitComponentTags } from '../../../../types';
import { DashboardState } from '../../../state';
import { appKitWidgetCreator } from './appKit';
import { WidgetSizePresets } from './sizing';
import { textWidgetCreator } from './text';
import { inputWidgetCreator } from './input';

const BASE_POSITION = {
  x: 0,
  y: 0,
  z: 0,
};

export const widgetCreator =
  (gridState: DashboardState['grid']) =>
  (componentTag: ComponentTag): Widget => {
    const { width, height, cellSize } = gridState;

    const { width: widgetPixelWidth, height: widgetPixelHeight } = WidgetSizePresets[componentTag];

    const preset = {
      id: nanoid(),
      componentTag,
      width: Math.min(Math.ceil(widgetPixelWidth / cellSize), width),
      height: Math.min(Math.ceil(widgetPixelHeight / cellSize), height),
      ...BASE_POSITION,
    };

    if (AppKitComponentTags.includes(componentTag as AppKitComponentTag)) {
      return appKitWidgetCreator(componentTag as AppKitComponentTag, preset);
    } else if (componentTag === 'text') {
      return textWidgetCreator(componentTag, preset);
    } else if (componentTag === 'input') {
      return inputWidgetCreator(componentTag, preset);
    }

    return preset;
  };
