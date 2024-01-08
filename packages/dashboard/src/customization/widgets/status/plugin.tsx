import React from 'react';
import StatusWidgetComponent from './component';
import StatusIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { StatusWidget } from '../types';
import {
  STATUS_WIDGET_INITIAL_HEIGHT,
  STATUS_WIDGET_INITIAL_WIDTH,
} from '../constants';

export const statusPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<StatusWidget>('status', {
      render: (widget) => <StatusWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'Status',
        icon: StatusIcon,
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
        height: STATUS_WIDGET_INITIAL_HEIGHT,
        width: STATUS_WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
