import { newSpecPage } from '@stencil/core/testing';
import { Viewport } from '@iot-app-kit/core';
import { IotScatterChart } from './iot-scatter-chart';
import { Components } from '../../components.d';
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { IotTimeSeriesConnector } from '../iot-time-series-connector/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';
import { mockEventsSDK } from '../../testing/mocks/eventsSDK';

const viewport: Viewport = {
  duration: 1000,
};

const scatterChartSpecPage = async (propOverrides: Partial<Components.IotScatterChart> = {}) => {
  const { query } = initialize({
    iotSiteWiseClient: mockSiteWiseSDK,
    iotEventsClient: mockEventsSDK,
  });

  const page = await newSpecPage({
    components: [IotScatterChart, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const scatterChart = page.doc.createElement('iot-scatter-chart') as CustomHTMLElement<Components.IotScatterChart>;
  const props: Partial<Components.IotScatterChart> = {
    isEditing: false,
    viewport,
    queries: [
      query.timeSeriesData({
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
  expect(scatterCharts[0].viewport).toEqual(viewport);
});
