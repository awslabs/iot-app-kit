import { mount } from '@cypress/vue';
import { h } from 'vue';
import {
  SiteWiseDataStreamQuery,
  TimeSeriesDataRequestSettings,
  StyleSettingsMap,
  initialize,
  IoTAppKitSession,
} from '@iot-app-kit/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { MINUTE_IN_MS } from '@iot-app-kit/core/src/common/time';
const { applyPolyfills, defineCustomElements } = require('@iot-app-kit/components/loader');
import '@synchro-charts/core/dist/synchro-charts/synchro-charts.css';

applyPolyfills().then(() => defineCustomElements());

export const testChartContainerClassName = 'test-chart-container';

export const testChartContainerClassNameSelector = `.${testChartContainerClassName}`;

const newDefaultAppKitSession = initialize({
  awsCredentials: {
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
  },
  awsRegion: 'us-east-1',
}).session();

const defaultChartType = 'iot-line-chart';

const defaultQueries = [
  {
    source: 'site-wise',
    assets: [
      {
        assetId: 'some-asset-id',
        properties: [{ propertyId: 'some-property-id' }],
      },
    ],
  },
];

const defaultSettings = {
  resolution: {
    [3 * MINUTE_IN_MS]: '1m',
  },
  fetchAggregatedData: true,
};

const start = new Date(2022, 0, 0, 0, 0);
const end = new Date(start.getTime() + 5 * MINUTE_IN_MS);

const defaultViewport = { start, end };

export const renderChart = (
  {
    chartType = defaultChartType,
    appKitSession = newDefaultAppKitSession,
    queries = defaultQueries,
    settings = defaultSettings,
    viewport = defaultViewport,
    styleSettings,
  }: {
    chartType?: string;
    appKitSession?: IoTAppKitSession;
    queries?: SiteWiseDataStreamQuery[];
    settings?: TimeSeriesDataRequestSettings;
    viewport?: MinimalViewPortConfig;
    styleSettings?: StyleSettingsMap;
  } = {
    chartType: defaultChartType,
    appKitSession: newDefaultAppKitSession,
    queries: defaultQueries,
    settings: defaultSettings,
    viewport: defaultViewport,
  }
) => {
  mount({
    data: () => {
      return {
        chartType,
      };
    },
    render: function () {
      const containerProps = { class: testChartContainerClassName, style: { width: '400px', height: '500px' } };
      const chartProps: any = { appKitSession, queries, settings, viewport, styleSettings };

      return (
        <div {...containerProps}>
          <this.chartType {...chartProps} />
          <sc-webgl-context />
        </div>
      );
    },
  });
};
