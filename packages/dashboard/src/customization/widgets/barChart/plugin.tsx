import React from 'react';
import { DashboardPlugin } from '~/customization/api';
import MultiQueryWidget from '../queryWidget/multiQueryWidget';
import { BarChartWidget } from '../types';
import BarChartWidgetComponent from './component';
import BarIcon from './icon';

export const barChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<BarChartWidget>('iot-bar', {
      render: (widget) => (
        <MultiQueryWidget {...widget}>
          <BarChartWidgetComponent {...widget} />
        </MultiQueryWidget>
      ),
      componentLibrary: {
        name: 'Bar',
        icon: BarIcon,
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
        height: 150,
        width: 270,
      },
    });
  },
};
