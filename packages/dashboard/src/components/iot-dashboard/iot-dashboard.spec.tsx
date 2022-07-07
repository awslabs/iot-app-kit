/* eslint-disable import/first */
jest.mock('resize-observer-polyfill');

import { MOCK_WIDGET } from '../../testing/mocks';

import { newSpecPage, jestSetupTestFramework } from '@stencil/core/testing';
jestSetupTestFramework();
import { IotDashboardWidget } from './iot-dashboard-widget/iot-dashboard-widget';
import { Components } from '../../components.d';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { IotDashboard } from './iot-dashboard';

const dashboardSpecPage = async (propOverrides: Partial<Components.IotDashboard> = {}) => {
  const page = await newSpecPage({
    components: [IotDashboard, IotDashboardWidget],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const dashboard = page.doc.createElement('iot-dashboard') as CustomHTMLElement<Components.IotDashboard>;
  const props: Partial<Components.IotDashboard> = {
    cellSize: 10,
    width: 1000,
    dashboardConfiguration: [],
    onDashboardConfigurationChange: () => {},
    ...propOverrides,
  };
  update(dashboard, props);
  page.body.appendChild(dashboard);

  await page.waitForChanges();

  return { page, dashboard };
};

it('renders', async () => {
  const { dashboard } = await dashboardSpecPage({
    dashboardConfiguration: [MOCK_WIDGET],
    cellSize: 5,
    width: 500,
  });

  const widgets = dashboard.querySelectorAll('iot-dashboard-widget');
  expect(widgets.length).toBe(1);
  const widget = widgets[0];

  expect(widget.widget).toEqual(MOCK_WIDGET);
  expect(widget).toMatchSnapshot();
  expect(widget).not.toHaveAttribute('isSelected');
});
