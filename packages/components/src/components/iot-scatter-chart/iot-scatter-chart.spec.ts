import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotScatterChart } from './iot-scatter-chart';
import { Components } from '../../components.d';
import { initialize, SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { createMockSource } from '../../testing/createMockSource';
import { IotConnector } from '../iot-connector/iot-connector';
import { CustomHTMLElement } from '../../testing/types';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';
import { update } from '../../testing/update';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const scatterChartSpecPage = async (propOverrides: Partial<Components.IotScatterChart> = {}) => {
  const appKitSession = initialize({ registerDataSources: false }).session();
  appKitSession.registerDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotScatterChart, IotConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const scatterChart = page.doc.createElement('iot-scatter-chart') as CustomHTMLElement<Components.IotScatterChart>;
  const props: Partial<Components.IotScatterChart> = {
    appKitSession,
    widgetId: 'test-scatter-chart-widget',
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
  update(scatterChart, props);
  page.body.appendChild(scatterChart);

  await page.waitForChanges();

  return { page, scatterChart };
};

it('renders', async () => {
  const { scatterChart } = await scatterChartSpecPage();
  const scatterCharts = scatterChart.querySelectorAll('sc-scatter-chart');
  expect(scatterCharts.length).toBe(1);
});
