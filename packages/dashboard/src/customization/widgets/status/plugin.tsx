import React from 'react';
import SingleQueryWidget from '../queryWidget/singleQueryWidget';
import StatusWidgetComponent from './component';
import StatusIcon from './icon';
import type { DashboardPlugin } from '~/customization/api';
import type { StatusWidget } from '../types';

export const statusPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<StatusWidget>('status', {
      render: (widget) => (
        <SingleQueryWidget {...widget}>
          <StatusWidgetComponent {...widget} />
        </SingleQueryWidget>
      ),
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
        height: 180,
        width: 270,
      },
    });
  },
};
