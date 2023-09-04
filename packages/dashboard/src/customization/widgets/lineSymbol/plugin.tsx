import React from 'react';
import LineWidgetComponent from './component';
import LineSymbolIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import { LineWidget } from '../types';

export const linePlugin: DashboardPlugin = {
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
  },
};
