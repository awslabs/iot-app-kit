import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotTable } from './iot-table';
import { Components } from '../../components.d';
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { IotTimeSeriesConnector } from '../iot-time-series-connector/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const tableSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const { query } = initialize({
    iotSiteWiseClient: mockSiteWiseSDK,
  });

  const page = await newSpecPage({
    components: [IotTable, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const table = page.doc.createElement('iot-table') as CustomHTMLElement<Components.IotTable>;
  const props: Partial<Components.IotTable> = {
    isEditing: false,
    viewport,
    queries: [
      query.timeSeriesData({
        assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
      }),
    ],
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
