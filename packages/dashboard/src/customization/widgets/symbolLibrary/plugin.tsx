import React from 'react';
import RectangleWidgetComponent from './rectangle/component';
import RectangleIcon from './rectangle/icon';
import type { DashboardPlugin } from '~/customization/api';
import { LineWidget, ShapeWidget } from '../types';
import TriangleWidgetComponent from './triangle/component';
import TriangleIcon from './triangle/icon';
import LineWidgetComponent from './line/component';
import LineSymbolIcon from './line/icon';

export const symbolLibraryPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<LineWidget>('line', {
      render: (widget) => <LineWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Line Symbol',
        icon: LineSymbolIcon,
      },
      properties: () => ({
        start: {
          x: 25,
          y: 200,
        },
        end: {
          x: 375,
          y: 200,
        },
      }),
      initialSize: {
        width: 400,
        height: 400,
      },
    });

    registerWidget<ShapeWidget>('rectangle', {
      render: (widget) => <RectangleWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Rectangle',
        icon: RectangleIcon,
      },
      initialSize: {
        width: 200,
        height: 100,
      },
    });

    registerWidget<ShapeWidget>('triangle', {
      render: (widget) => <TriangleWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Triangle',
        icon: TriangleIcon,
      },
      initialSize: {
        width: 200,
        height: 200,
      },
    });
  },
};
