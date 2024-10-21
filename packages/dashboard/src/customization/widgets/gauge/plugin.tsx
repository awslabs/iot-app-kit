import React from 'react';
import type { DashboardPlugin } from '~/customization/api';
import type { GaugeWidget } from '~/customization/widgets/types';
import {
  GAUGE_WIDGET_INITIAL_HEIGHT,
  GAUGE_WIDGET_INITIAL_WIDTH,
} from '../constants';
import GaugeWidgetComponent from './component';
import GaugeIcon from './icon';

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
        resolution: '0',
        showName: true,
        showUnit: true,
        fontSize: 40,
        unitFontSize: 16,
        labelFontSize: 16,
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
