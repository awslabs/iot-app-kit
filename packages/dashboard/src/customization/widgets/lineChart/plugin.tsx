import React from 'react';
import { DashboardPlugin } from '~/customization/api';
import MultiQueryWidget from '../queryWidget/multiQueryWidget';
import { LineChartWidget } from '../types';
import LineChartWidgetComponent from './component';
import LineIcon from './icon';

export const lineChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<LineChartWidget>('iot-line', {
      render: (widget) => (
        <MultiQueryWidget {...widget}>
          <LineChartWidgetComponent {...widget} />
        </MultiQueryWidget>
      ),
      componentLibrary: {
        name: 'Line',
        icon: LineIcon,
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
