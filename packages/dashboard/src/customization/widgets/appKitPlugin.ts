import type { DashboardPlugin } from '~/customization/api';
import { barChartPlugin } from './barChart/plugin';
import { gaugePlugin } from './gauge/plugin';
import { kpiPlugin } from './kpi/plugin';
import { lineScatterChartPlugin } from './lineScatterChart/plugin';
import { statusTimelineChartPlugin } from './status-timeline/statusTimelinePlugin';
import { statusPlugin } from './status/plugin';
import { tablePlugin } from './table/plugin';

export const appKitPlugin: DashboardPlugin = {
  install: (options) => {
    lineScatterChartPlugin.install(options);
    barChartPlugin.install(options);
    statusTimelineChartPlugin.install(options);
    kpiPlugin.install(options);
    gaugePlugin.install(options);
    statusPlugin.install(options);
    tablePlugin.install(options);
  },
};
