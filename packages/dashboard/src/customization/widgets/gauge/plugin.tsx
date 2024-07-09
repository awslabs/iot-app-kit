import React from 'react';
import GaugeWidgetComponent from './component';
import GaugeIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { GaugeWidget } from '../types';
import {
  GAUGE_WIDGET_INITIAL_HEIGHT,
  GAUGE_WIDGET_INITIAL_WIDTH,
} from '../constants';

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
        fontSize: 40,
        unitFontSize: 16,
        labelFontSize: 12,
        yMin: 0,
        yMax: 100,
        thresholds: [],
      }),
      initialSize: {
        height: GAUGE_WIDGET_INITIAL_HEIGHT,
        width: GAUGE_WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
