import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotBarChart } from './iot-bar-chart';
import { Components } from '../../components.d';
import { initialize, query, SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { createMockSource } from '../../testing/createMockSource';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';
import { IotTimeSeriesConnector } from '../iot-time-series-connector.ts/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const barChartSpecPage = async (propOverrides: Partial<Components.IotBarChart> = {}) => {
  const appKit = initialize({
    registerDataSources: false,
    iotSiteWiseClient: mockSiteWiseSDK,
  });
  appKit.registerTimeSeriesDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotBarChart, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const barChart = page.doc.createElement('iot-bar-chart') as CustomHTMLElement<Components.IotBarChart>;
  const props: Partial<Components.IotBarChart> = {
    appKit,
    widgetId: 'test-bar-chart-widget',
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
  update(barChart, props);
  page.body.appendChild(barChart);

  await page.waitForChanges();

  return { page, barChart };
};

it('renders', async () => {
  const { barChart } = await barChartSpecPage();
  const barCharts = barChart.querySelectorAll('sc-bar-chart');
  expect(barCharts.length).toBe(1);
});
