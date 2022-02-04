import { newSpecPage } from '@stencil/core/testing';
import { SiteWiseDataStreamQuery, initialize } from '@iot-app-kit/core';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotKpi } from './iot-kpi';
import { Components } from '../../components.d';
import { createMockSource } from '../../testing/createMockSource';
import { IotConnector } from '../iot-connector/iot-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const kpiSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const appKitSession = initialize({ registerDataSources: false }).session();
  appKitSession.registerDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotKpi, IotConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const kpi = page.doc.createElement('iot-kpi') as CustomHTMLElement<Components.IotKpi>;
  const props: Partial<Components.IotKpi> = {
    appKitSession,
    widgetId: 'test-kpi-widget',
    isEditing: false,
    queries: [
      {
        source: 'test-mock',
        assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
      } as SiteWiseDataStreamQuery,
    ], // static casting because of legacy sw
    viewport,
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
