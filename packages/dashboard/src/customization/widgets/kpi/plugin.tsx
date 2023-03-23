import React from 'react';
import SingleQueryWidget from '../queryWidget/singleQueryWidget';
import KPIWidgetComponent from './component';
import KPIIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { KPIWidget } from '../types';

export const kpiPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<KPIWidget>('kpi', {
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
