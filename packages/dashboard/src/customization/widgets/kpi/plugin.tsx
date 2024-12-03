import type { DashboardPlugin } from '../../../customization/api';
import {
  KPI_WIDGET_INITIAL_HEIGHT,
  KPI_WIDGET_INITIAL_WIDTH,
} from '../constants';
import type { KPIWidget } from '../types';
import KPIWidgetComponent from './component';
import KPIIcon from './icon';

export const kpiPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<KPIWidget>('kpi', {
      render: (widget) => <KPIWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'KPI',
        icon: KPIIcon,
      },
      properties: () => ({
        resolution: '0',
        queryConfig: {
          source: 'iotsitewise',
          query: undefined,
        },
        primaryFont: {},
        secondaryFont: {},
        showName: true,
        showTimestamp: true,
        showUnit: true,
        showAggregationAndResolution: true,
        showDataQuality: true,
      }),
      initialSize: {
        height: KPI_WIDGET_INITIAL_HEIGHT,
        width: KPI_WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
