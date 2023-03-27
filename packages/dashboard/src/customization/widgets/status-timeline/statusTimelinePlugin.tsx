import * as React from 'react';
import { DashboardPlugin } from '~/customization/api';
import MultiQueryWidget from '../queryWidget/multiQueryWidget';
import { StatusTimelineWidget } from '../types';
import StatusTimelineWidgetComponent from './statusTimeline';
import StatusTimelineIcon from './statusTimelineIcon';

export const statusTimelineChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<StatusTimelineWidget>('status-timeline', {
      render: (widget) => (
        <MultiQueryWidget {...widget}>
          <StatusTimelineWidgetComponent {...widget} />
        </MultiQueryWidget>
      ),
      componentLibrary: {
        name: 'Timeline',
        icon: StatusTimelineIcon,
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
