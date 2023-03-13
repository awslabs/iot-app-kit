import { newSpecPage } from '@stencil/core/testing';
import { Viewport } from '@iot-app-kit/core';
import { IotLineChart } from './iot-line-chart';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../testing/types';
import { IotTimeSeriesConnector } from '../iot-time-series-connector/iot-time-series-connector';
import { update } from '../../testing/update';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';

const viewport: Viewport = {
  duration: 1000,
};

const lineChartSpecPage = async (propOverrides: Partial<Components.IotKpi> = {}) => {
  const query = mockTimeSeriesDataQuery([]);

  const page = await newSpecPage({
    components: [IotLineChart, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const lineChart = page.doc.createElement('iot-line-chart') as CustomHTMLElement<Components.IotLineChart>;
  const props: Partial<Components.IotStatusGrid> = {
    isEditing: false,
    viewport,
    queries: [query],
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
  expect(lineCharts[0].viewport).toEqual(viewport);
});
