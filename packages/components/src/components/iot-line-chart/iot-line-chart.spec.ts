import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotLineChart } from './iot-line-chart';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../testing/types';
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { IotTimeSeriesConnector } from '../iot-time-series-connector/iot-time-series-connector';
import { update } from '../../testing/update';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';
import { mockEventsSDK } from '../../testing/mocks/eventsSDK';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const lineChartSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const { query } = initialize({
    iotSiteWiseClient: mockSiteWiseSDK,
    iotEventsClient: mockEventsSDK,
  });

  const page = await newSpecPage({
    components: [IotLineChart, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const lineChart = page.doc.createElement('iot-line-chart') as CustomHTMLElement<Components.IotStatusGrid>;
  const props: Partial<Components.IotStatusGrid> = {
    isEditing: false,
    viewport,
    queries: [
      query.timeSeriesData({
        assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
      }),
    ],
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
