import * as React from 'react';
import { DashboardPlugin } from '~/customization/api';
import MultiQueryWidget from '../queryWidget/multiQueryWidget';
import { StatusTimelineWidget } from '../types';
import StatusTimelineWidgetComponent from './statusTimeline';
import StatusTimelineIcon from './statusTimelineIcon';
import { queryWidgetOnDrop } from '../queryWidget/multiQueryWidgetDrop';
import { WIDGET_INITIAL_HEIGHT, WIDGET_INITIAL_WIDTH } from '../constants';

export const statusTimelineChartPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<StatusTimelineWidget>('status-timeline', {
      render: (widget) => (
        <MultiQueryWidget widget={widget} onDrop={queryWidgetOnDrop}>
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
        height: WIDGET_INITIAL_HEIGHT,
        width: WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
