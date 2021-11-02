import { newSpecPage } from '@stencil/core/testing';
import { DataStream, MinimalLiveViewport } from '@synchro-charts/core';
import { IotKpi } from './iot-kpi';
import { SECOND_IN_MS } from '../../utils/time';
import { AnyDataStreamQuery, DataSource, DataSourceRequest, getDataModule } from '../../data-module';
import { Components } from '../../components.d';
import { DATA_STREAM } from '../../testing/__mocks__/mockWidgetProperties';
import { CustomHTMLElement } from '../../utils/types';
import { SiteWiseDataStreamQuery } from '../../data-sources/site-wise/types.d';
import { update } from '../../common/tests/merge';

const viewport: MinimalLiveViewport = {
  duration: SECOND_IN_MS,
};
// A simple mock data source, which will always immediately return a successful response of your choosing.
const createMockSource = (dataStreams: DataStream[]): DataSource => ({
  name: 'test-mock',
  initiateRequest: ({ onSuccess }: DataSourceRequest<AnyDataStreamQuery>) => onSuccess(dataStreams),
  getRequestsFromQuery: () => dataStreams.map(({ data, aggregates, ...dataStreamInfo }) => dataStreamInfo),
});

const newValueSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  getDataModule().registerDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotKpi],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const kpi = page.doc.createElement('iot-kpi') as CustomHTMLElement<Components.IotKpi>;
  const props: Partial<Components.IotKpi> = {
    widgetId: 'test-kpi-widget',
    isEditing: false,
    query: {
      source: 'test-mock',
      assets: [{ assetId: 'some-asset-id', propertyIds: ['some-property-id'] }],
    } as SiteWiseDataStreamQuery, // static casting because of legacy sw
    viewport,
    ...propOverrides,
  };
  update(kpi, props);
  page.body.appendChild(kpi);

  await page.waitForChanges();

  return { page, kpi };
};

it('renders the synchro chart kpi', async () => {
  const { kpi } = await newValueSpecPage();
  const scKpi = kpi.querySelectorAll('sc-kpi');
  expect(scKpi.length).toBe(1);
});
