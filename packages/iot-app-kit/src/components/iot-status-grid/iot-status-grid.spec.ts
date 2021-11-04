import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotStatusGrid } from './iot-status-grid';
import { SECOND_IN_MS } from '../../utils/time';
import { getDataModule } from '../../data-module';
import { Components } from '../../components.d';
import { DATA_STREAM } from '../../testing/__mocks__/mockWidgetProperties';
import { CustomHTMLElement } from '../../utils/types';
import { SiteWiseDataStreamQuery } from '../../data-sources/site-wise/types.d';
import { update } from '../../common/tests/merge';
import { IotConnector } from '../../common/iot-connector';
import { createMockSource } from '../../testing/testing-ground/createMockSource';

const viewport: MinimalLiveViewport = {
  duration: SECOND_IN_MS,
};

const statusGridSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
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
