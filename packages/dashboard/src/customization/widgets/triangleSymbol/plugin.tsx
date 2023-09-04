import React from 'react';
import TriangleWidgetComponent from './component';
import TriangleIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import { TriangleWidget } from '../types';

export const trianglePlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<TriangleWidget>('triangle', {
      render: (widget) => <TriangleWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Triangle',
        icon: TriangleIcon,
      },
      properties: () => ({
        borderStyle: 'solid',
        fill: 'none',
        borderColor: 'black',
        borderThickness: 5,
      }),
      initialSize: {
        width: 200,
        height: 200,
      },
    });
  },
};
