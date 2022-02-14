import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotLineChart } from './iot-line-chart';
import { Components } from '../../components.d';
import { createMockSource } from '../../testing/createMockSource';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';
import { CustomHTMLElement } from '../../testing/types';
import { initialize, query, SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { IotTimeSeriesConnector } from '../iot-time-series-connector.ts/iot-time-series-connector';
import { update } from '../../testing/update';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const lineChartSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const appKit = initialize({
    registerDataSources: false,
    iotSiteWiseClient: mockSiteWiseSDK,
  });
  appKit.registerTimeSeriesDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotLineChart, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const lineChart = page.doc.createElement('iot-line-chart') as CustomHTMLElement<Components.IotStatusGrid>;
  const props: Partial<Components.IotStatusGrid> = {
    appKit,
    widgetId: 'test-line-chart-widget',
    isEditing: false,
    query: query.iotsitewise.timeSeriesData({
      queries: [
        {
          source: 'test-mock',
          assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
        } as SiteWiseDataStreamQuery,
      ],
      request: {
        viewport,
      },
    }),
    ...propOverrides,
  };
  update(lineChart, props);
  page.body.appendChild(lineChart);

  await page.waitForChanges();

  return { page, lineChart };
};

it('renders', async () => {
  const { lineChart } = await lineChartSpecPage();
  const lineCharts = lineChart.querySelectorAll('sc-line-chart');
  expect(lineCharts.length).toBe(1);
});
