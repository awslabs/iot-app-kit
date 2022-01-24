import { mount } from '@cypress/vue';
import { h } from 'vue';
import {
  DataModule,
  DataStream,
  SiteWiseDataStreamQuery,
  TimeSeriesDataRequestSettings,
  StyleSettingsMap,
} from '@iot-app-kit/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
const { applyPolyfills, defineCustomElements } = require('@iot-app-kit/components/loader');
import { DATA_STREAM } from '@iot-app-kit/components/src/testing/mockWidgetProperties';
import { SITEWISE_DATA_SOURCE, TimeSeriesDataRequest } from '@iot-app-kit/core';
import { SECOND_IN_MS, MINUTE_IN_MS, HOUR_IN_MS } from '@iot-app-kit/core/src/common/time';
import { DataSource, DataSourceRequest } from '@iot-app-kit/core/src/data-module/types';
import { toDataStreamId } from '@iot-app-kit/core/src/data-sources/site-wise/util/dataStreamId';
import { IotAppKitDataModule } from '@iot-app-kit/core/src/data-module/IotAppKitDataModule';
import '@synchro-charts/core/dist/synchro-charts/synchro-charts.css';

applyPolyfills().then(() => defineCustomElements());

export const testChartContainerClassName = 'test-chart-container';

export const testChartContainerClassNameSelector = `.${testChartContainerClassName}`;

const FIVE_MINUTES_IN_MS = MINUTE_IN_MS * 5;
const THREE_MINUTES_IN_MS = MINUTE_IN_MS * 3;

const start = new Date(2022, 0, 0, 0, 0);
const end = new Date(start.getTime() + FIVE_MINUTES_IN_MS);

const DEFAULT_RESOLUTION_MAPPING = {
  [THREE_MINUTES_IN_MS]: MINUTE_IN_MS,
};

const sinusoid = (factor: number) => {
  return Math.sin(factor / 10);
};

const data = Array.from(Array(HOUR_IN_MS / SECOND_IN_MS)).map((_, i) => ({
  x: new Date(start.getTime() - HOUR_IN_MS / 2 + SECOND_IN_MS * i).getTime(),
  y: sinusoid(i),
}));

const aggregates = {
  [MINUTE_IN_MS]: Array.from(Array(HOUR_IN_MS / MINUTE_IN_MS)).map((_, i) => ({
    x: new Date(start.getTime() - HOUR_IN_MS / 2 + MINUTE_IN_MS * i).getTime(),
    y: sinusoid(i),
  })),
};

const determineResolution = ({ resolution, request }: { resolution: number; request: TimeSeriesDataRequest }) => {
  const viewportRange = (request.viewport as any).end - (request.viewport as any).start;

  let determinedResolution = resolution;

  if (request.settings?.resolution == '0') {
    return 0;
  }

  if (request.settings?.resolution) {
    const matchedResolution = Object.entries(request.settings.resolution)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .find((resolutionMapping) => parseInt(resolutionMapping[0]) < viewportRange);

    if (matchedResolution) {
      determinedResolution = matchedResolution[1] as number;
    }
  }

  return determinedResolution;
};

const createMockSiteWiseDataSource = (
  dataStreams: DataStream[],
  resolution: number = 0
): DataSource<SiteWiseDataStreamQuery> => ({
  name: SITEWISE_DATA_SOURCE,
  initiateRequest: ({ request, onSuccess }: DataSourceRequest<SiteWiseDataStreamQuery>) => {
    const start = (request.viewport as any).start.getTime();
    const end = (request.viewport as any).end.getTime();

    let determinedResolution = determineResolution({ resolution, request });

    if (determinedResolution === 0) {
      onSuccess([
        {
          ...dataStreams[0],
          resolution: determinedResolution,
          data: data.filter(({ x }) => x > start && x < end),
        },
      ]);
    } else {
      onSuccess([
        {
          ...dataStreams[0],
          resolution: determinedResolution,
          aggregates: { [MINUTE_IN_MS]: aggregates[MINUTE_IN_MS].filter(({ x }) => x > start && x < end) },
        },
      ]);
    }
  },
  getRequestsFromQuery: ({ query, request }) => {
    let determinedResolution = determineResolution({ resolution, request });

    return query.assets
      .map(({ assetId, properties }) =>
        properties.map(({ propertyId }) => ({
          id: toDataStreamId({ assetId, propertyId }),
          resolution: determinedResolution,
        }))
      )
      .flat();
  },
});

const defaultAppKit = new IotAppKitDataModule();
const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
defaultAppKit.registerDataSource(dataSource);

const defaultChartType = 'iot-line-chart';

const defaultQueries = [
  {
    source: dataSource.name,
    assets: [
      {
        assetId: 'some-asset-id',
        properties: [{ propertyId: 'some-property-id' }],
      },
    ],
  },
];

const defaultSettings = { resolution: DEFAULT_RESOLUTION_MAPPING, fetchAggregatedData: true };

const defaultViewport = { start, end };

export const renderChart = (
  {
    chartType = defaultChartType,
    appKit = defaultAppKit,
    queries = defaultQueries,
    settings = defaultSettings,
    viewport = defaultViewport,
    styleSettings,
  }: {
    chartType?: string;
    appKit?: DataModule;
    queries?: SiteWiseDataStreamQuery[];
    settings?: TimeSeriesDataRequestSettings;
    viewport?: MinimalViewPortConfig;
    styleSettings?: StyleSettingsMap;
  } = {
    chartType: defaultChartType,
    appKit: defaultAppKit,
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
      const chartProps: any = { appKit, queries, settings, viewport, styleSettings };

      return (
        <div {...containerProps}>
          <this.chartType {...chartProps} />
          <sc-webgl-context />
        </div>
      );
    },
  });
};
