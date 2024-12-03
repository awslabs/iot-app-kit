import type { DashboardPlugin } from '../../../customization/api';
import {
  STATUS_WIDGET_INITIAL_HEIGHT,
  STATUS_WIDGET_INITIAL_WIDTH,
} from '../constants';
import type { StatusWidget } from '../types';
import StatusWidgetComponent from './component';

export const statusPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<StatusWidget>('status', {
      render: (widget) => <StatusWidgetComponent {...widget} />,
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
      }),
      initialSize: {
        height: STATUS_WIDGET_INITIAL_HEIGHT,
        width: STATUS_WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
