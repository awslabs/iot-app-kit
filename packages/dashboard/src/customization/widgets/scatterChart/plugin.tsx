import React from 'react';
import MultiQueryWidget from '../queryWidget/multiQueryWidget';
import ScatterChartWidgetComponent from './component';
import ScatterIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { ScatterChartWidget } from '../types';
import { PropertyDataType } from '@aws-sdk/client-iotsitewise';

export const scatterChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<ScatterChartWidget>('scatter-chart', {
      render: (widget) => (
        <MultiQueryWidget {...widget} allowedDataTypes={[PropertyDataType.DOUBLE, PropertyDataType.INTEGER]}>
          <ScatterChartWidgetComponent {...widget} />
        </MultiQueryWidget>
      ),
      componentLibrary: {
        name: 'Scatter',
        icon: ScatterIcon,
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
