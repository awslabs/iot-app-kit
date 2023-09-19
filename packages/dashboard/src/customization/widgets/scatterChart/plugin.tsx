import React from 'react';
import ScatterChartWidgetComponent from './component';
import ScatterIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { ScatterChartWidget } from '../types';
import { WIDGET_INITIAL_HEIGHT, WIDGET_INITIAL_WIDTH } from '../constants';

export const scatterChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<ScatterChartWidget>('scatter-chart', {
      render: (widget) => <ScatterChartWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Scatter',
        icon: ScatterIcon,
      },
      properties: () => ({
        queryConfig: {
          source: 'iotsitewise',
          query: undefined,
        },
        axis: {
          showX: true,
          showY: true,
        },
      }),
      initialSize: {
        height: WIDGET_INITIAL_HEIGHT,
        width: WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
