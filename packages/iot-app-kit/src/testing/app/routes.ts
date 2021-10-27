/**
 * All test routes should follow the path structure of
 *
 * /test/{COMPONENT_NAME}/{TEST_ROUTE_COMPONENT_NAME}
 */

export const routes = [
  {
    url: '/tests/iot-map',
    component: 'iot-map-standard',
  },
  {
    url: '/',
    component: 'testing-ground',
  },
  {
    url: '/demo',
    component: 'synchro-demo',
  },
  {
    url: '/tests/kpi',
    component: 'monitor-kpi-standard',
  },
  {
    url: '/tests/status-grid',
    component: 'monitor-status-grid-standard',
  },
  {
    url: '/tests/bp-asset-explorer/standard',
    component: 'bp-asset-explorer-standard',
  },
  {
    url: '/tests/bp-asset-explorer/error',
    component: 'bp-asset-explorer-error',
  },
  {
    url: '/tests/bp-asset-explorer/loading',
    component: 'bp-asset-explorer-loading',
  },
  {
    url: '/tests/bp-asset-explorer/empty',
    component: 'bp-asset-explorer-empty',
  },
  {
    url: '/tests/bp-asset-explorer/singleSelect',
    component: 'bp-asset-explorer-single-select',
  },
  {
    url: '/tests/bp-asset-explorer/multiSelect',
    component: 'bp-asset-explorer-multi-select',
  },
  {
    url: '/tests/bp-asset-explorer/huge',
    component: 'bp-asset-explorer-huge',
  },
  {
    url: '/tests/monitor-webgl-chart/circle-point-shaders',
    component: 'monitor-circle-point-shaders',
  },
  {
    url: '/tests/monitor-webgl-chart/angled-line-segment',
    component: 'monitor-angled-line-segment',
  },
  {
    url: '/tests/monitor-webgl-chart/single-bar',
    component: 'monitor-single-bar',
  },
  {
    url: '/tests/monitor-webgl-chart/multiple-bars',
    component: 'monitor-multiple-bars',
  },
  {
    url: '/tests/monitor-webgl-chart/single-colored-bar',
    component: 'monitor-single-colored-bar',
  },
  {
    url: '/tests/monitor-webgl-chart/straight-line-segment-colored',
    component: 'monitor-straight-line-segment-colored',
  },
  {
    url: '/tests/monitor-webgl-chart/straight-line-segment',
    component: 'monitor-straight-line-segment',
  },
  {
    url: '/tests/monitor-webgl-chart/line-chart-dynamic-data-streams',
    component: 'monitor-webgl-line-chart-dynamic-data-streams',
  },
  {
    url: '/tests/monitor-webgl-chart/line-chart-dynamic-buffer',
    component: 'monitor-webgl-line-chart-dynamic-buffer',
  },
  {
    url: '/tests/monitor-webgl-chart/line-chart-dynamic-data',
    component: 'monitor-webgl-line-chart-dynamic-data',
  },
  {
    url: '/tests/monitor-webgl-chart/standard-with-legend',
    component: 'monitor-webgl-chart-standard-with-legend',
  },
  {
    url: '/tests/monitor-webgl-chart/standard-with-legend-on-right',
    component: 'monitor-webgl-chart-standard-with-legend-on-right',
  },
  {
    url: '/tests/monitor-webgl-chart/standard',
    component: 'monitor-webgl-chart-standard',
  },
  {
    url: '/tests/monitor-webgl-chart/monitor-webgl-chart-large-viewport',
    component: 'monitor-webgl-chart-large-viewport',
  },
  {
    url: '/tests/monitor-webgl-chart/multi',
    component: 'monitor-webgl-chart-multi',
  },
  {
    url: '/tests/monitor-scatter-chart/scatter-chart-dynamic-data',
    component: 'monitor-scatter-chart-dynamic-data',
  },
  {
    url: '/tests/monitor-scatter-chart/trend-line-with-legend',
    component: 'monitor-scatter-chart-trend-line-with-legend',
  },
  {
    url: '/tests/monitor-scatter-chart/trend-line-color-configuration',
    component: 'monitor-scatter-chart-trend-line-color-configuration',
  },
  {
    url: '/tests/monitor-webgl-chart/colored-point',
    component: 'monitor-line-chart-colored-point',
  },
  {
    url: '/tests/monitor-webgl-chart/multiple-lines',
    component: 'monitor-multiple-lines',
  },
  {
    url: '/tests/monitor-webgl-chart/multiple-lines-overlapping',
    component: 'monitor-multiple-lines-overlapping',
  },
  {
    url: '/tests/bp-bar-chart/pos-neg',
    component: 'bp-bar-chart-pos-neg',
  },
  {
    url: '/tests/monitor-expandable-input/standard',
    component: 'monitor-expandable-input-standard',
  },
  {
    url: '/tests/bp-chart-legend-standard/standard',
    component: 'bp-chart-legend-standard',
  },
  {
    url: '/tests/monitor-sizer-provider/monitor-size-provider-standard',
    component: 'monitor-size-provider-standard',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/standard',
    component: 'monitor-webgl-bar-chart-standard',
  },
  {
    url: '/tests/monitor-webgl-chart/monitor-webgl-chart-dynamic-charts',
    component: 'monitor-webgl-chart-dynamic-charts',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/bar-chart-dynamic-data-streams',
    component: 'monitor-webgl-bar-chart-dynamic-data-streams',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/bar-chart-dynamic-data',
    component: 'monitor-webgl-bar-chart-dynamic-data',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/bar-chart-fast-viewport',
    component: 'monitor-webgl-bar-chart-fast-viewport',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/bar-chart-dynamic-buffer',
    component: 'monitor-webgl-bar-chart-dynamic-buffer',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/negative',
    component: 'monitor-webgl-bar-chart-negative',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/pos-neg',
    component: 'monitor-webgl-bar-chart-positive-negative',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/threshold/coloration',
    component: 'monitor-webgl-bar-chart-threshold-coloration',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/threshold/coloration-exact-point',
    component: 'monitor-webgl-bar-chart-threshold-coloration-exact-point',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/threshold/coloration-multiple-data-stream',
    component: 'monitor-webgl-bar-chart-threshold-coloration-multiple-data-stream',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/threshold/coloration-multiple-thresholds',
    component: 'monitor-webgl-bar-chart-threshold-coloration-multiple-thresholds',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/threshold/no-coloration',
    component: 'monitor-webgl-bar-chart-threshold-no-coloration',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/threshold/coloration-band',
    component: 'monitor-webgl-bar-chart-threshold-coloration-band',
  },
  {
    url: '/tests/monitor-webgl-chart/performance/monitor-line-chart-stream-data',
    component: 'monitor-line-chart-stream-data',
  },
  {
    url: '/tests/monitor-lazily-load/monitor-lazily-load-standard',
    component: 'monitor-lazily-load-standard',
  },
  {
    url: '/tests/monitor-lazily-load/monitor-lazily-load-web-component',
    component: 'monitor-lazily-load-web-component',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/margin',
    component: 'monitor-webgl-bar-chart-margin',
  },
  {
    url: '/tests/monitor-webgl-bar-chart/start-from-zero',
    component: 'monitor-webgl-bar-chart-start-from-zero',
  },
  {
    url: '/tests/monitor-webgl-chart/annotations',
    component: 'monitor-webgl-chart-annotations',
  },
  {
    url: '/tests/monitor-webgl-chart/threshold/coloration-split-half',
    component: 'monitor-webgl-chart-threshold-coloration-split-half',
  },
  {
    url: '/tests/monitor-webgl-chart/threshold/coloration-exact-point',
    component: 'monitor-webgl-chart-threshold-coloration-exact-point',
  },
  {
    url: '/tests/monitor-webgl-chart/threshold/coloration-multiple-data-stream',
    component: 'monitor-webgl-chart-threshold-coloration-multiple-data-stream',
  },
  {
    url: '/tests/monitor-webgl-chart/threshold/coloration-multiple-thresholds',
    component: 'monitor-webgl-chart-threshold-coloration-multiple-thresholds',
  },
  {
    url: '/tests/monitor-webgl-chart/threshold/coloration-band',
    component: 'monitor-webgl-chart-threshold-coloration-band',
  },
  {
    url: '/tests/monitor-webgl-chart/annotations/always-in-viewport',
    component: 'monitor-webgl-chart-annotations-always-in-viewport',
  },
  {
    url: '/tests/monitor-webgl-chart/tooltip/multiple-data-streams',
    component: 'monitor-webgl-chart-tooltip-with-multiple-data-streams',
  },
  {
    url: '/tests/monitor-scatter-chart/tooltip/multiple-data-streams-and-trends',
    component: 'monitor-scatter-chart-tooltip-with-multiple-data-streams-and-trends',
  },
  {
    url: '/tests/monitor-scatter-chart/threshold/coloration',
    component: 'monitor-scatter-chart-threshold',
  },
  {
    url: '/tests/monitor-scatter-chart/threshold/coloration-exact-point',
    component: 'monitor-scatter-chart-threshold-coloration-exact-point',
  },
  {
    url: '/tests/monitor-scatter-chart/threshold/coloration-multiple-data-stream',
    component: 'monitor-scatter-chart-threshold-coloration-multiple-data-stream',
  },
  {
    url: '/tests/monitor-scatter-chart/threshold/coloration-multiple-thresholds',
    component: 'monitor-scatter-chart-threshold-coloration-multiple-thresholds',
  },
  {
    url: '/tests/monitor-scatter-chart/threshold/coloration-band',
    component: 'monitor-scatter-chart-threshold-coloration-band',
  },
  {
    url: '/tests/monitor-webgl-chart/axis',
    component: 'monitor-webgl-chart-axis',
  },
  {
    url: '/tests/chart/y-range',
    component: 'monitor-chart-y-range',
  },
  {
    url: '/tests/monitor-webgl-chart/annotations/no-annotations',
    component: 'monitor-webgl-chart-no-annotations',
  },
  {
    url: '/tests/monitor-scatter-chart/threshold/no-coloration',
    component: 'monitor-scatter-chart-threshold-no-coloration',
  },
  {
    url: '/tests/latest-value',
    component: 'monitor-latest-value-standard',
  },
  {
    url: '/tests/sitewise-model-list/error',
    component: 'sitewise-model-list-error',
  },
  {
    url: '/tests/sitewise-model-list/loading',
    component: 'sitewise-model-list-loading',
  },
  {
    url: '/tests/sitewise-asset-list/no-select',
    component: 'sitewise-asset-list-no-select',
  },
  {
    url: '/tests/sitewise-asset-list/error',
    component: 'sitewise-asset-list-error',
  },
  {
    url: '/tests/sitewise-model-list/data',
    component: 'sitewise-model-list-with-data',
  },
  {
    url: '/tests/sitewise-asset-list/loading',
    component: 'sitewise-asset-list-loading',
  },
  {
    url: '/tests/sitewise-asset-list/multiple-lists',
    component: 'sitewise-asset-list-multiple-lists',
  },
  {
    url: '/tests/sitewise-components/threshold-coloration-toggle',
    component: 'sitewise-component-threshold-coloration-toggle',
  },
  {
    url: '/tests/common-components/monitor-toggle',
    component: 'monitor-toggle-test',
  },
  {
    url: '/tests/monitor-webgl-chart/single-status',
    component: 'single-status',
  },
  {
    url: '/tests/monitor-webgl-chart/single-colored-status',
    component: 'single-colored-status',
  },
  {
    url: '/tests/monitor-webgl-chart/multiple-statuses',
    component: 'multiple-statuses',
  },
  {
    url: '/tests/status-chart/standard',
    component: 'status-chart-standard',
  },
  {
    url: '/tests/status-chart/margin',
    component: 'status-chart-margin',
  },
  {
    url: '/tests/status-chart/status-chart-dynamic-data-streams',
    component: 'status-chart-dynamic-data-streams',
  },
  {
    url: '/tests/status-chart/status-chart-dynamic-data',
    component: 'status-chart-dynamic-data',
  },
  {
    url: '/tests/status-chart/status-chart-dynamic-buffer',
    component: 'status-chart-dynamic-buffer',
  },
  {
    url: '/tests/status-chart/status-chart-fast-viewport',
    component: 'status-chart-fast-viewport',
  },
  {
    url: '/tests/status-chart/threshold/coloration',
    component: 'status-chart-threshold-coloration',
  },
  {
    url: '/tests/status-chart/threshold/coloration-exact-point',
    component: 'status-chart-threshold-coloration-exact-point',
  },
  {
    url: '/tests/status-chart/threshold/coloration-multiple-data-stream',
    component: 'status-chart-threshold-coloration-multiple-data-stream',
  },
  {
    url: '/tests/status-chart/threshold/coloration-multiple-thresholds',
    component: 'status-chart-threshold-coloration-multiple-thresholds',
  },
  {
    url: '/tests/status-chart/threshold/coloration-band',
    component: 'status-chart-threshold-coloration-band',
  },
  {
    url: '/tests/status-chart/threshold/no-coloration',
    component: 'status-chart-threshold-no-coloration',
  },
  {
    url: '/tests/status-chart/multiple-data-streams',
    component: 'status-chart-multiple-data-streams',
  },
  {
    url: '/tests/status-chart/raw-data',
    component: 'status-chart-raw-data',
  },
  {
    url: '/tests/line-chart/viewport-change',
    component: 'line-chart-viewport-change',
  },
  {
    url: '/tests/widget-test-route',
    component: 'widget-test-route',
  },
];
