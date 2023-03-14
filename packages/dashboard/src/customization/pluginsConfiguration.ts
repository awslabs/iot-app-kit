import {
  barChartPlugin,
  kpiPlugin,
  lineChartPlugin,
  scatterChartPlugin,
  statusPlugin,
  tablePlugin,
  textPlugin,
} from './widgets';

/**
 * plugin list to be added to the dashboard
 *
 * order matters for component library
 *
 */
export default [lineChartPlugin, scatterChartPlugin, barChartPlugin, kpiPlugin, statusPlugin, tablePlugin, textPlugin];
