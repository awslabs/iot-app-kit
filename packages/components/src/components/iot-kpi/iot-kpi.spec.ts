import { newSpecPage } from '@stencil/core/testing';
import { initialize } from '@iot-app-kit/core';
import { query } from '@iot-app-kit/source-iotsitewise';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotKpi } from './iot-kpi';
import { Components } from '../../components.d';
import { createMockSource } from '../../testing/createMockSource';
import { IotTimeSeriesConnector } from '../iot-time-series-connector.ts/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const kpiSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const appKit = initialize({
    registerDataSources: false,
    iotSiteWiseClient: mockSiteWiseSDK,
  });
  appKit.registerTimeSeriesDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotKpi, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const kpi = page.doc.createElement('iot-kpi') as CustomHTMLElement<Components.IotKpi>;
  const props: Partial<Components.IotKpi> = {
    appKit,
    widgetId: 'test-kpi-widget',
    isEditing: false,
    viewport,
    queries: [
      query.iotsitewise.timeSeriesData({
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
});
