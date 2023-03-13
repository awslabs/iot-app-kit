import { newSpecPage } from '@stencil/core/testing';
import { Viewport } from '@iot-app-kit/core';
import { IotStatusGrid } from './iot-status-grid';
import { Components } from '../../components.d';
import { IotTimeSeriesConnector } from '../iot-time-series-connector/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';

const viewport: Viewport = {
  duration: 1000,
};

const statusGridSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const query = mockTimeSeriesDataQuery([]);

  const page = await newSpecPage({
    components: [IotStatusGrid, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const statusGrid = page.doc.createElement('iot-status-grid') as CustomHTMLElement<Components.IotStatusGrid>;
  const props: Partial<Components.IotStatusGrid> = {
    isEditing: false,
    viewport,
    queries: [query],
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
  expect(statusGrids[0].viewport).toEqual(viewport);
});
