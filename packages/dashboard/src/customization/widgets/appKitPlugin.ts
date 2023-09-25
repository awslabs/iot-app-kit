import { DashboardPlugin } from '../api';

import { lineScatterChartPlugin } from './lineScatterChart/plugin';
import { barChartPlugin } from './barChart/plugin';
import { kpiPlugin } from './kpi/plugin';
import { lineChartPlugin } from './lineChart/plugin';
import { scatterChartPlugin } from './scatterChart/plugin';
import { statusTimelineChartPlugin } from './status-timeline/statusTimelinePlugin';
import { tablePlugin } from './table/plugin';
import { getConfigValue } from '@iot-app-kit/react-components';

export const appKitPlugin: DashboardPlugin = {
  install: (options) => {
    const showEcharts = getConfigValue('useEcharts');

    if (showEcharts) {
      lineScatterChartPlugin.install(options);
    } else {
      lineChartPlugin.install(options);
      scatterChartPlugin.install(options);
    }
    barChartPlugin.install(options);
    statusTimelineChartPlugin.install(options);
    kpiPlugin.install(options);
    tablePlugin.install(options);
  },
};
