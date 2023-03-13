import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotTable } from './iot-table';
import { Components } from '../../components.d';
import { IotTimeSeriesConnector } from '../iot-time-series-connector/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const tableSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const query = mockTimeSeriesDataQuery([]);

  const page = await newSpecPage({
    components: [IotTable, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const table = page.doc.createElement('iot-table') as CustomHTMLElement<Components.IotTable>;
  const items: Components.IotTable['items'] = [
    {
      property: {
        $cellRef: {
          id: 'some-asset-id',
          resolution: 0,
        },
      },
    },
  ];

  const columnDefinitions: Components.IotTable['columnDefinitions'] = [
    {
      header: 'Header',
      key: 'property',
    },
  ];
  const props: Partial<Components.IotTable> = {
    isEditing: false,
    viewport,
    items,
    columnDefinitions,
    queries: [query],
    ...propOverrides,
  };

  update(table, props);
  page.body.appendChild(table);

  await page.waitForChanges();

  return { page, table };
};

it('renders', async () => {
  const { table } = await tableSpecPage();
  const tables = table.querySelectorAll('iot-react-table');
  expect(tables.length).toBe(1);
});
