import { initialize } from '@iot-app-kit/source-iotsitewise';
import { newSpecPage } from '@stencil/core/testing';
import { ViewPortConfig } from '@synchro-charts/core';
import { Components } from '../../components.d';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';
import { CustomHTMLElement } from '../../testing/types';
import { IotTimeSeriesConnector } from '../iot-time-series-connector/iot-time-series-connector';
import { IotDial } from './iot-dial';
import { update } from '../../testing/update';

const viewport: ViewPortConfig = {
  duration: 1000,
  yMin: 0,
  yMax: 2000,
};

const kpiSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const { query } = initialize({
    iotSiteWiseClient: mockSiteWiseSDK,
  });

  const page = await newSpecPage({
    components: [IotDial, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const dial = page.doc.createElement('iot-dial') as CustomHTMLElement<Components.IotDial>;
  const props: Partial<Components.IotDial> = {
    isEditing: false,
    viewport,
    queries: [
      query.timeSeriesData({
        assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
      }),
    ],
    ...propOverrides,
  };
  update(dial, props);
  page.body.appendChild(dial);

  await page.waitForChanges();

  return { page, dial };
};

it('renders', async () => {
  const { dial } = await kpiSpecPage();
  const scDial = dial.querySelectorAll('sc-dial');
  expect(scDial.length).toBe(1);
});
