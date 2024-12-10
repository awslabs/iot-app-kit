import BarChartWidgetComponent from './component';
import BarIcon from './icon';
import type { DashboardPlugin } from '../../../customization/api';
import type { BarChartWidget } from '../types';
import { WIDGET_INITIAL_HEIGHT, WIDGET_INITIAL_WIDTH } from '../constants';

export const barChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<BarChartWidget>('bar-chart', {
      render: (widget) => <BarChartWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Bar',
        icon: BarIcon,
      },
      properties: () => ({
        aggregationType: 'AVERAGE',
        resolution: undefined,
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
        height: WIDGET_INITIAL_HEIGHT,
        width: WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
