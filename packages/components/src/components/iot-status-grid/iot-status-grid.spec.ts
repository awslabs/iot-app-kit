import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotStatusGrid } from './iot-status-grid';
import { Components } from '../../components.d';
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { IotTimeSeriesConnector } from '../iot-time-series-connector/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';
import { mockEventsSDK } from '../../testing/mocks/eventsSDK';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const statusGridSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const { query } = initialize({
    iotSiteWiseClient: mockSiteWiseSDK,
    iotEventsClient: mockEventsSDK,
  });

  const page = await newSpecPage({
    components: [IotStatusGrid, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const statusGrid = page.doc.createElement('iot-status-grid') as CustomHTMLElement<Components.IotStatusGrid>;
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
