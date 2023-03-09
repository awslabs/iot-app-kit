import { newSpecPage } from '@stencil/core/testing';
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { Viewport } from '@iot-app-kit/core';
import { IotKpi } from './iot-kpi';
import { Components } from '../../components.d';
import { IotTimeSeriesConnector } from '../iot-time-series-connector/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';
import { mockEventsSDK } from '../../testing/mocks/eventsSDK';

const viewport: Viewport = {
  duration: 1000,
};

const kpiSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const { query } = initialize({
    iotSiteWiseClient: mockSiteWiseSDK,
    iotEventsClient: mockEventsSDK,
  });

  const page = await newSpecPage({
    components: [IotKpi, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const kpi = page.doc.createElement('iot-kpi') as CustomHTMLElement<Components.IotKpi>;
  const props: Partial<Components.IotKpi> = {
    isEditing: false,
    viewport,
    queries: [
      query.timeSeriesData({
        assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
      }),
    ],
    ...propOverrides,
  };
  update(kpi, props);
  page.body.appendChild(kpi);

  await page.waitForChanges();

  return { page, kpi };
};

it('renders', async () => {
  const { kpi } = await kpiSpecPage();
  const scKpi = kpi.querySelectorAll('sc-kpi');
  expect(scKpi.length).toBe(1);
  expect(scKpi[0].viewport).toEqual(viewport);
});
