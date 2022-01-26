import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotTable } from './iot-table';
import { Components } from '../../components.d';
import { initialize, SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { createMockSource } from '../../testing/createMockSource';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';
import { IotConnector } from '../iot-connector/iot-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const tableSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const appKitSession = initialize({ registerDataSources: false }).session();
  appKitSession.registerDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotTable, IotConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const table = page.doc.createElement('iot-table') as CustomHTMLElement<Components.IotTable>;
  const props: Partial<Components.IotTable> = {
    appKitSession,
    widgetId: 'test-table-widget',
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

  update(table, props);
  page.body.appendChild(table);

  await page.waitForChanges();

  return { page, table };
};

it('renders', async () => {
  const { table } = await tableSpecPage();
  const tables = table.querySelectorAll('sc-table');
  expect(tables.length).toBe(1);
});
