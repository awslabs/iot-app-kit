import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotBarChart } from './iot-bar-chart';
import { Components } from '../../components.d';
import { getDataModule, initialize, SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { createMockSource } from '../../testing/createMockSource';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';
import { IotConnector } from '../iot-connector/iot-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const barChartSpecPage = async (propOverrides: Partial<Components.IotBarChart> = {}) => {
  initialize({ registerDataSources: false });
  getDataModule().registerDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotBarChart, IotConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const barChart = page.doc.createElement('iot-bar-chart') as CustomHTMLElement<Components.IotBarChart>;
  const props: Partial<Components.IotBarChart> = {
    widgetId: 'test-bar-chart-widget',
    isEditing: false,
    query: {
      source: 'test-mock',
      assets: [{ assetId: 'some-asset-id', propertyIds: ['some-property-id'] }],
    } as SiteWiseDataStreamQuery,
    viewport,
    ...propOverrides,
  };
  update(barChart, props);
  page.body.appendChild(barChart);

  await page.waitForChanges();

  return { page, barChart };
};

it('renders', async () => {
  const { barChart } = await barChartSpecPage();
  const barCharts = barChart.querySelectorAll('sc-bar-chart');
  expect(barCharts.length).toBe(1);
});
