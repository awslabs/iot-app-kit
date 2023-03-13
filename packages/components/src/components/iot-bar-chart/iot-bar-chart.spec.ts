import { Viewport } from '@iot-app-kit/core';
import { newSpecPage } from '@stencil/core/testing';
import { IotBarChart } from './iot-bar-chart';
import { Components } from '../../components.d';
import { IotTimeSeriesConnector } from '../iot-time-series-connector/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';

const viewport: Viewport = {
  duration: 1000,
};

const barChartSpecPage = async (propOverrides: Partial<Components.IotBarChart> = {}) => {
  const query = mockTimeSeriesDataQuery([]);
  const page = await newSpecPage({
    components: [IotBarChart, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const barChart = page.doc.createElement('iot-bar-chart') as CustomHTMLElement<Components.IotBarChart>;
  const props: Partial<Components.IotBarChart> = {
    isEditing: false,
    viewport,
    queries: [query],
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
  expect(barCharts[0].viewport).toEqual(viewport);
});
