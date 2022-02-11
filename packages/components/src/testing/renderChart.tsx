import { mount } from '@cypress/vue';
import { h } from 'vue';
import {
  StyleSettingsMap,
  initialize,
  IoTAppKit,
  query,
  TimeSeriesQuery,
  SiteWiseTimeSeriesDataProvider,
} from '@iot-app-kit/core';
import { MINUTE_IN_MS } from '@iot-app-kit/core/src/common/time';
const { applyPolyfills, defineCustomElements } = require('@iot-app-kit/components/loader');
import '@synchro-charts/core/dist/synchro-charts/synchro-charts.css';

applyPolyfills().then(() => defineCustomElements());

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
  fetchAggregatedData: true,
};

const start = new Date(2022, 0, 0, 0, 0);
const end = new Date(start.getTime() + 5 * MINUTE_IN_MS);

const defaultViewport = { start, end };

const defaultQuery = query.iotsitewise.timeSeriesData({
  queries: [
    {
      source: 'site-wise',
      assets: [
        {
          assetId: 'some-asset-id',
          properties: [{ propertyId: 'some-property-id' }],
        },
      ],
    },
  ],
  request: {
    viewport: defaultViewport,
    settings: defaultSettings,
  },
});

export const renderChart = (
  {
    chartType = defaultChartType,
    appKit = newDefaultAppKit,
    query = defaultQuery,
    styleSettings,
  }: {
    chartType?: string;
    appKit?: IoTAppKit;
    query?: TimeSeriesQuery<SiteWiseTimeSeriesDataProvider>;
    styleSettings?: StyleSettingsMap;
  } = {
    chartType: defaultChartType,
    appKit: newDefaultAppKit,
    query: defaultQuery,
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
      const chartProps: any = { appKit, query, styleSettings };

      return (
        <div {...containerProps}>
          <this.chartType {...chartProps} />
          <sc-webgl-context />
        </div>
      );
    },
  });
};
