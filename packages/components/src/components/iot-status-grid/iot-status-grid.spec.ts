import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotStatusGrid } from './iot-status-grid';
import { Components } from '../../components.d';
import { initialize, getDataModule, SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { createMockSource } from '../../testing/createMockSource';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';
import { IotConnector } from '../iot-connector/iot-connector';
import { CustomHTMLElement } from '../../testing/types';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const statusGridSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  initialize({ registerDataSources: false });
  getDataModule().registerDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotStatusGrid, IotConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const statusGrid = page.doc.createElement('iot-status-grid') as CustomHTMLElement<Components.IotStatusGrid>;
  const props: Partial<Components.IotStatusGrid> = {
    widgetId: 'test-status-grid-widget',
    isEditing: false,
    query: {
      source: 'test-mock',
      assets: [{ assetId: 'some-asset-id', propertyIds: ['some-property-id'] }],
    } as SiteWiseDataStreamQuery, // static casting because of legacy sw
    viewport,
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
