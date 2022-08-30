import { mount } from '@cypress/vue';
import { h } from 'vue';
import '@synchro-charts/core';
import {
  StyleSettingsMap,
  TimeQuery,
  TimeSeriesDataRequest,
  TimeSeriesData,
  TimeSeriesDataRequestSettings,
} from '@iot-app-kit/core';
import { initialize } from '@iot-app-kit/source-iotsitewise';
import {
  MinimalViewPortConfig,
  Annotations,
  MinimalSizeConfig,
  Trend,
  ScaleConfig,
  MovementConfig,
  MessageOverrides,
  LayoutConfig,
  LegendConfig,
  Axis,
} from '@synchro-charts/core';
import { MINUTE_IN_MS } from '@iot-app-kit/core/src/common/time';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineCustomElements } = require('@iot-app-kit/components/loader');
import '../styles/global.css';

defineCustomElements();

export const testChartContainerClassName = 'test-chart-container';

export const testChartContainerClassNameSelector = `.${testChartContainerClassName}`;

const { query } = initialize({
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
  query.timeSeriesData({
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
    queries = defaultQueries,
    viewport = defaultViewport,
    settings = defaultSettings,
    styleSettings,
    annotations,
    widgetId,
    size,
    trends,
    scale,
    movement,
    messageOverrides,
    layout,
    legend,
    isEditing,
    gestures,
    axis,
    significantDigits,
  }: {
    chartType?: string;
    queries?: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
    viewport?: MinimalViewPortConfig;
    settings?: TimeSeriesDataRequestSettings;
    styleSettings?: StyleSettingsMap;
    annotations?: Annotations;
    widgetId?: string;
    size?: MinimalSizeConfig | string;
    trends?: Trend[];
    scale?: ScaleConfig;
    movement?: MovementConfig;
    messageOverrides?: MessageOverrides;
    layout?: LayoutConfig;
    legend?: LegendConfig;
    isEditing?: boolean;
    gestures?: boolean;
    axis?: Axis.Options;
    significantDigits?: number;
  } = {
    chartType: defaultChartType,
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
      const chartProps: any = {
        queries,
        viewport,
        settings,
        styleSettings,
        annotations,
        widgetId,
        size,
        trends,
        scale,
        movement,
        messageOverrides,
        layout,
        legend,
        isEditing,
        gestures,
        axis,
        significantDigits,
      };

      return (
        <div {...containerProps}>
          <this.chartType {...chartProps} />
          <iot-webgl-context />
        </div>
      );
    },
  });
};
