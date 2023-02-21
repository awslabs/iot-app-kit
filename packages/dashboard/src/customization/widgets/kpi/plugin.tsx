import React from 'react';
import { DashboardPlugin } from '~/customization/api';
import SingleQueryWidget from '../queryWidget/singleQueryWidget';
import { KPIWidget } from '../types';
import KPIWidgetComponent from './component';
import KPIIcon from './icon';

export const kpiPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<KPIWidget>('iot-kpi', {
      render: (widget) => (
        <SingleQueryWidget {...widget}>
          <KPIWidgetComponent {...widget} />
        </SingleQueryWidget>
      ),
      componentLibrary: {
        name: 'KPI',
        icon: KPIIcon,
      },
      properties: () => ({
        queryConfig: {
          source: 'iotsitewise',
          query: undefined,
        },
        primaryFont: {},
        secondaryFont: {},
      }),
      initialSize: {
        height: 120,
        width: 270,
      },
    });
  },
};
