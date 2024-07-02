import { DashboardPlugin } from '../api';

import { lineScatterChartPlugin } from './lineScatterChart/plugin';
import { barChartPlugin } from './barChart/plugin';
import { kpiPlugin } from './kpi/plugin';
import { sceneViewPlugin } from './sceneView/plugin';
import { statusTimelineChartPlugin } from './status-timeline/statusTimelinePlugin';
import { tablePlugin } from './table/plugin';
import { statusPlugin } from './status/plugin';
import { gaugePlugin } from './gauge/plugin';

const hasGauge = !!localStorage.getItem('HAS_GAUGE_WIDGET');

export const appKitPlugin: DashboardPlugin = {
  install: (options) => {
    lineScatterChartPlugin.install(options);
    barChartPlugin.install(options);
    statusTimelineChartPlugin.install(options);
    kpiPlugin.install(options);
    sceneViewPlugin.install(options);
    hasGauge && gaugePlugin.install(options);
    statusPlugin.install(options);
    tablePlugin.install(options);
  },
};
