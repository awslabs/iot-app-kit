import React from 'react';
import SceneViewWidgetComponent from './component';
import KPIIcon from './icon2';
import type { DashboardPlugin } from '~/customization/api';
import type { SceneViewWidget } from '../types';
import { WIDGET_INITIAL_HEIGHT, WIDGET_INITIAL_WIDTH } from '../constants';

export const sceneViewPlugin: DashboardPlugin = {
  install: ({ registerWidget }) => {
    registerWidget<SceneViewWidget>('scene-view', {
      render: (widget) => <SceneViewWidgetComponent {...widget} />,
      componentLibrary: {
        name: 'KPI',
        icon: KPIIcon,
      },
      properties: () => ({

        resolution: undefined,
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
        height: WIDGET_INITIAL_HEIGHT,
        width: WIDGET_INITIAL_WIDTH,
      },
    });
  },
};
