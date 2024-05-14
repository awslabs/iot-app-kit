import React from 'react';
import GaugeWidgetComponent from './component';
import GaugeIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { GaugeWidget } from '../types';
import { WIDGET_INITIAL_HEIGHT, WIDGET_INITIAL_WIDTH } from '../constants';

export const gaugePlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<GaugeWidget>('gauge', {
      render: (widget) => <GaugeWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Gauge',
        icon: GaugeIcon,
      },
      properties: () => ({
        queryConfig: {
          source: 'iotsitewise',
          query: undefined,
        },
        showName: true,
        showUnit: true,
        yMin: 0,
        yMax: 100,
        thresholds: [],
      }),
      initialSize: {
        height: WIDGET_INITIAL_HEIGHT,
        width: WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
