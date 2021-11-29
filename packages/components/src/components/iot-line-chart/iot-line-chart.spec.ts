import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotLineChart } from './iot-line-chart';
import { registerDataSource } from '@iot-app-kit/core';
import { Components } from '../../components.d';
import { createMockSource } from '../../testing/createMockSource';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';
import { CustomHTMLElement } from '../../testing/types';
import { initialize, SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { IotConnector } from '../iot-connector/iot-connector';
import { update } from '../../testing/update';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const lineChartSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const appKit = initialize({ registerDataSources: false });
  registerDataSource(appKit, createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotLineChart, IotConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const lineChart = page.doc.createElement('iot-line-chart') as CustomHTMLElement<Components.IotStatusGrid>;
  const props: Partial<Components.IotStatusGrid> = {
    appKit,
    widgetId: 'test-line-chart-widget',
    isEditing: false,
    query: {
      source: 'test-mock',
      assets: [{ assetId: 'some-asset-id', propertyIds: ['some-property-id'] }],
    } as SiteWiseDataStreamQuery, // static casting because of legacy sw
    viewport,
    ...propOverrides,
  };
  update(lineChart, props);
  page.body.appendChild(lineChart);

  await page.waitForChanges();

  return { page, lineChart };
};

it('renders', async () => {
  const { lineChart } = await lineChartSpecPage();
  const lineCharts = lineChart.querySelectorAll('sc-line-chart');
  expect(lineCharts.length).toBe(1);
});
