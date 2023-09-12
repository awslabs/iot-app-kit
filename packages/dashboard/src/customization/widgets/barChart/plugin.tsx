import React from 'react';
import MultiQueryWidget from '../queryWidget/multiQueryWidget';
import BarChartWidgetComponent from './component';
import BarIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { BarChartWidget } from '../types';
import { PropertyDataType } from '@aws-sdk/client-iotsitewise';
import { queryWidgetOnDrop } from '../queryWidget/multiQueryWidgetDrop';

export const barChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<BarChartWidget>('bar-chart', {
      render: (widget) => (
        <MultiQueryWidget widget={widget} onDrop={queryWidgetOnDrop}  allowedDataTypes={[PropertyDataType.DOUBLE, PropertyDataType.INTEGER]}>
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
        height: 250,
        width: 270,
      },
    });
  },
};
