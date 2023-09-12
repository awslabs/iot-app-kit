import React from 'react';
import MultiQueryWidget from '../queryWidget/multiQueryWidget';
import LineScatterChartWidgetComponent from './component';
import LineIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { LineScatterChartWidget } from '../types';
import { PropertyDataType } from '@aws-sdk/client-iotsitewise';

export const lineScatterChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<LineScatterChartWidget>('line-scatter-chart', {
      render: (widget) => (
        <MultiQueryWidget {...widget} allowedDataTypes={[PropertyDataType.DOUBLE, PropertyDataType.INTEGER]}>
          <LineScatterChartWidgetComponent {...widget} />
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
      }),
      initialSize: {
        height: 250,
        width: 370,
      },
    });
  },
};
