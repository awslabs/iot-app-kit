import React from 'react';
import { DashboardPlugin } from '~/customization/api';
import SingleQueryWidget from '../queryWidget/singleQueryWidget';
import { StatusWidget } from '../types';
import StatusWidgetComponent from './component';
import StatusIcon from './icon';

export const statusPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<StatusWidget>('iot-status', {
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
