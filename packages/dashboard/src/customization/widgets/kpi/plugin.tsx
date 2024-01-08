import React from 'react';
import KPIWidgetComponent from './component';
import KPIIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { KPIWidget } from '../types';
import {
  KPI_WIDGET_INITIAL_HEIGHT,
  KPI_WIDGET_INITIAL_WIDTH,
} from '../constants';

export const kpiPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<KPIWidget>('kpi', {
      render: (widget) => <KPIWidgetComponent {...widget} />,
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
        height: KPI_WIDGET_INITIAL_HEIGHT,
        width: KPI_WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
