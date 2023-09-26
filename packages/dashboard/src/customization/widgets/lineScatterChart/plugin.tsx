import React from 'react';
import LineScatterChartWidgetComponent from './component';
import LineIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { LineScatterChartWidget } from '../types';
import { WIDGET_INITIAL_HEIGHT, WIDGET_INITIAL_WIDTH } from '../constants';

export const lineScatterChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<LineScatterChartWidget>('line-scatter-chart', {
      render: (widget) => <LineScatterChartWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Line',
        icon: LineIcon,
      },
      properties: () => ({
        queryConfig: {
          source: 'iotsitewise',
          query: undefined,
        },
        line: {
          connectionStyle: 'linear',
          style: 'solid',
        },
        symbol: {
          style: 'filled-circle',
        },
        axis: {
          yVisible: true,
          xVisible: true,
        },
        legend: {
          visible: true,
        },
      }),
      initialSize: {
        height: WIDGET_INITIAL_HEIGHT,
        width: WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
