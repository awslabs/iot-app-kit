import {
  barChartPlugin,
  kpiPlugin,
  lineChartPlugin,
  scatterChartPlugin,
  statusPlugin,
  statusTimelineChartPlugin,
  tablePlugin,
  textPlugin,
} from './widgets';

/**
 * plugin list to be added to the dashboard
 *
 * order matters for component library
 *
 */
export default [
  lineChartPlugin,
  scatterChartPlugin,
  barChartPlugin,
  statusTimelineChartPlugin,
  kpiPlugin,
  statusPlugin,
  tablePlugin,
  textPlugin,
];
