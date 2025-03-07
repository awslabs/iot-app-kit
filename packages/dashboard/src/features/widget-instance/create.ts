import { nanoid } from '@reduxjs/toolkit';
import {
  type RegisteredWidgetType,
  Registry,
} from '~/features/widget-plugins/registry';
import type { WidgetInstance } from '~/features/widget-instance/instance';
import type { DashboardState } from '~/store/state';

const create =
  (grid: DashboardState['grid']) =>
  <const WidgetType extends RegisteredWidgetType>(
    type: WidgetType
  ): WidgetInstance<WidgetType> => {
    const {
      configuration: { initialProperties, initialSize },
    } = Registry.get(type);

    return {
      id: nanoid(),
      type,
      width: Math.min(Math.ceil(initialSize.width / grid.cellSize), grid.width),
      height: Math.min(
        Math.ceil(initialSize.height / grid.cellSize),
        grid.height
      ),
      x: 0,
      y: 0,
      z: 0,
      properties: initialProperties,
    } as WidgetInstance<WidgetType>;
  };

export default create;
