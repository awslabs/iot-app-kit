import React from 'react';
import MultiQueryWidget from '../queryWidget/multiQueryWidget';
import LineChartWidgetComponent from './component';
import LineIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { LineChartWidget } from '../types';
import { PropertyDataType } from '@aws-sdk/client-iotsitewise';

export const lineChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<LineChartWidget>('line-chart', {
      render: (widget) => (
        <MultiQueryWidget {...widget} allowedDataTypes={[PropertyDataType.DOUBLE, PropertyDataType.INTEGER]}>
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
