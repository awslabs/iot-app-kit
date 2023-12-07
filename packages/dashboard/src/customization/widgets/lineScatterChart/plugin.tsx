import React from 'react';
import LineScatterChartWidgetComponent from './component';
import LineIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { LineScatterChartWidget } from '../types';
import { WIDGET_INITIAL_HEIGHT, WIDGET_INITIAL_WIDTH } from '../constants';

export const lineScatterChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<LineScatterChartWidget>('xy-plot', {
      render: (widget) => <LineScatterChartWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Line',
        icon: LineIcon,
      },
      properties: () => ({
        aggregationType: 'AVERAGE',
        resolution: undefined,
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
          position: 'right',
          width: '30%',
          height: '30%',
          visibleContent: {
            unit: true,
            asset: true,
          },
        },
      }),
      initialSize: {
        height: WIDGET_INITIAL_HEIGHT,
        width: WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
