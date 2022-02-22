import { mount } from '@cypress/vue';
import { h } from 'vue';
import '@synchro-charts/core';
import {
  StyleSettingsMap,
  initialize,
  IoTAppKit,
  TimeSeriesQuery,
  SiteWiseTimeSeriesDataProvider,
  TimeSeriesDataRequestSettings,
} from '@iot-app-kit/core';
import { query } from '@iot-app-kit/source-iotsitewise';
import { MinimalViewPortConfig, Annotations } from '@synchro-charts/core';
import { MINUTE_IN_MS } from '@iot-app-kit/core/src/common/time';
const { defineCustomElements } = require('@iot-app-kit/components/loader');
import '@synchro-charts/core/dist/synchro-charts/synchro-charts.css';

defineCustomElements();

export const testChartContainerClassName = 'test-chart-container';

export const testChartContainerClassNameSelector = `.${testChartContainerClassName}`;

const newDefaultAppKit = initialize({
  awsCredentials: {
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
  },
  awsRegion: 'us-east-1',
});

const defaultChartType = 'iot-line-chart';

const defaultSettings = {
  resolution: {
    [3 * MINUTE_IN_MS]: '1m',
  },
};

const start = new Date(2022, 0, 0, 0, 0);
const end = new Date(start.getTime() + 5 * MINUTE_IN_MS);

const defaultViewport = { start, end };

const defaultQueries = [
  query.iotsitewise.timeSeriesData({
    assets: [
      {
        assetId: 'some-asset-id',
        properties: [{ propertyId: 'some-property-id' }],
      },
    ],
  }),
];

export const renderChart = (
  {
    chartType = defaultChartType,
    appKit = newDefaultAppKit,
    queries = defaultQueries,
    viewport = defaultViewport,
    settings = defaultSettings,
    styleSettings,
    annotations,
  }: {
    chartType?: string;
    appKit?: IoTAppKit;
    queries?: TimeSeriesQuery<SiteWiseTimeSeriesDataProvider>[];
    viewport?: MinimalViewPortConfig;
    settings?: TimeSeriesDataRequestSettings;
    styleSettings?: StyleSettingsMap;
    annotations?: Annotations;
  } = {
    chartType: defaultChartType,
    appKit: newDefaultAppKit,
    queries: defaultQueries,
    viewport: defaultViewport,
    settings: defaultSettings,
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
      const chartProps: any = { appKit, queries, viewport, settings, styleSettings, annotations };

      return (
        <div {...containerProps}>
          <this.chartType {...chartProps} />
          <iot-webgl-context />
        </div>
      );
    },
  });
};
