import React from 'react';
import EllipseWidgetComponent from './component';
import EllipseIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import { EllipseWidget } from '../types';

export const ellipsePlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<EllipseWidget>('ellipse', {
      render: (widget) => <EllipseWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Circle/Ellipse',
        icon: EllipseIcon,
      },
      properties: () => ({
        borderStyle: 'solid',
        fill: 'none',
        borderColor: 'black',
        borderThickness: 5,
      }),
      initialSize: {
        width: 200,
        height: 150,
      },
    });
  },
};
