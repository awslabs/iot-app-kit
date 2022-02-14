import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotStatusGrid } from './iot-status-grid';
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

const statusGridSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const appKit = initialize({
    registerDataSources: false,
    iotSiteWiseClient: mockSiteWiseSDK,
  });
  appKit.registerTimeSeriesDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotStatusGrid, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const statusGrid = page.doc.createElement('iot-status-grid') as CustomHTMLElement<Components.IotStatusGrid>;
  const props: Partial<Components.IotStatusGrid> = {
    appKit,
    widgetId: 'test-status-grid-widget',
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
  update(statusGrid, props);
  page.body.appendChild(statusGrid);

  await page.waitForChanges();

  return { page, statusGrid };
};

it('renders', async () => {
  const { statusGrid } = await statusGridSpecPage();
  const statusGrids = statusGrid.querySelectorAll('sc-status-grid');
  expect(statusGrids.length).toBe(1);
});
