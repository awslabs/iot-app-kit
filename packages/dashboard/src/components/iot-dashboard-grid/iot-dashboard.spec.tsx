/* eslint-disable import/first */

jest.mock('resize-observer-polyfill');

import { MockDashboardFactory, MOCK_EMPTY_DASHBOARD, MOCK_KPI_WIDGET } from '../../testing/mocks';

import { newSpecPage, jestSetupTestFramework } from '@stencil/core/testing';
jestSetupTestFramework();
import { IotDashboardWidget } from './iot-dashboard-widget/iot-dashboard-widget';
import { Components } from '../../components';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { IotDashboardInternal } from './iot-dashboard-grid-internal';

const dashboardSpecPage = async (propOverrides: Partial<Components.IotDashboardInternal> = {}) => {
  const page = await newSpecPage({
    components: [IotDashboardInternal, IotDashboardWidget],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const dashboard = page.doc.createElement(
    'iot-dashboard-grid-internal'
  ) as CustomHTMLElement<Components.IotDashboardInternal>;
  const props: Partial<Components.IotDashboardInternal> = {
    cellSize: 10,
    width: 1000,
    dashboardConfiguration: MOCK_EMPTY_DASHBOARD,
    ...propOverrides,
  };
  update(dashboard, props);
  page.body.appendChild(dashboard);

  await page.waitForChanges();

  return { page, dashboard };
};

it('renders', async () => {
  const { dashboard } = await dashboardSpecPage({
    dashboardConfiguration: MockDashboardFactory.get({ widgets: [MOCK_KPI_WIDGET] }),
    cellSize: 5,
    width: 500,
  });

  const widgets = dashboard.querySelectorAll('iot-dashboard-widget');
  expect(widgets.length).toBe(1);
  const widget = widgets[0];

  expect(widget.widget).toEqual(MOCK_KPI_WIDGET);
  expect(widget).toMatchSnapshot();
  expect(widget).not.toHaveAttribute('isSelected');
});
