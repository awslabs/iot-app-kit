import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotScatterChart } from './iot-scatter-chart';
import { Components } from '../../components.d';
import { initialize } from '@iot-app-kit/core';
import { query } from '@iot-app-kit/source-iotsitewise';
import { createMockSource } from '../../testing/createMockSource';
import { IotTimeSeriesConnector } from '../iot-time-series-connector.ts/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';
import { update } from '../../testing/update';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const scatterChartSpecPage = async (propOverrides: Partial<Components.IotScatterChart> = {}) => {
  const appKit = initialize({
    registerDataSources: false,
    iotSiteWiseClient: mockSiteWiseSDK,
  });
  appKit.registerTimeSeriesDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotScatterChart, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const scatterChart = page.doc.createElement('iot-scatter-chart') as CustomHTMLElement<Components.IotScatterChart>;
  const props: Partial<Components.IotScatterChart> = {
    appKit,
    widgetId: 'test-scatter-chart-widget',
    isEditing: false,
    viewport,
    queries: [
      query.iotsitewise.timeSeriesData({
        assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
      }),
    ],
    ...propOverrides,
  };
  update(scatterChart, props);
  page.body.appendChild(scatterChart);

  await page.waitForChanges();

  return { page, scatterChart };
};

it('renders', async () => {
  const { scatterChart } = await scatterChartSpecPage();
  const scatterCharts = scatterChart.querySelectorAll('sc-scatter-chart');
  expect(scatterCharts.length).toBe(1);
});
