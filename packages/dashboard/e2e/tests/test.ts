import { Browser, Page, test as base } from '@playwright/test';
import { DashboardPage } from './dashboard/DashboardPage';
import { createWorkerFixture, type MockServiceWorker } from 'playwright-msw';
import { handlers } from '../../src/msw/handlers';
import { rest } from 'msw';
import { ResourceExplorer } from './resourceExplorer/ResourceExplorer';
import { ConfigPanel } from './configPanel/ConfigPanel';
const MODELED_PROPERTY_NAME = 'Max Temperature';
interface Fixtures {
  worker: MockServiceWorker;
  rest: typeof rest;
  dashboardWithLineWidget: DashboardPage;
  dashboardWithTextWidget: DashboardPage;
  dashboardWithKPIWidget: DashboardPage;
  dashboardWithTableWidget: DashboardPage;
  dashboardWithGaugeWidget: DashboardPage;
  dashboardWithGaugeWidgetWithProperty: DashboardPage;
  resourceExplorer: ResourceExplorer;
  configPanel: ConfigPanel;
}

export const test = base.extend<Fixtures>({
  worker: createWorkerFixture(handlers),
  rest,
  resourceExplorer: async ({ page }, use) => {
    const resourceExplorer = new ResourceExplorer({ page });
    await use(resourceExplorer);
  },
  dashboardWithTextWidget: async ({ page, browser }, use) => {
    const dashboardWithTextWidget = await createNewDashboardWithWidget(
      'text',
      page,
      browser
    );
    return use(dashboardWithTextWidget);
  },
  dashboardWithLineWidget: async ({ page, browser, resourceExplorer }, use) => {
    const dashboardWithLineWidget = await createNewDashboardWithWidget(
      'line',
      page,
      browser,
      resourceExplorer
    );

    return use(dashboardWithLineWidget);
  },
  dashboardWithKPIWidget: async ({ page, browser }, use) => {
    const dashboardWithKPIWidget = await createNewDashboardWithWidget(
      'kpi',
      page,
      browser
    );

    return use(dashboardWithKPIWidget);
  },
  dashboardWithTableWidget: async ({ page, browser }, use) => {
    const dashboardWithTableWidget = await createNewDashboardWithWidget(
      'table',
      page,
      browser
    );

    return use(dashboardWithTableWidget);
  },
  dashboardWithGaugeWidget: async ({ page, browser }, use) => {
    const dashboardWithGaugeWidget = await createNewDashboardWithWidget(
      'gauge',
      page,
      browser
    );

    return use(dashboardWithGaugeWidget);
  },
  dashboardWithGaugeWidgetWithProperty: async (
    { page, browser, resourceExplorer },
    use
  ) => {
    const dashboardWithGaugeWidgetWithProperty =
      await createNewDashboardWithWidget(
        'gauge',
        page,
        browser,
        resourceExplorer
      );

    return use(dashboardWithGaugeWidgetWithProperty);
  },
  configPanel: async ({ page }, use) => {
    const configPanel = new ConfigPanel({ page });
    await use(configPanel);
  },
});
export { expect } from '@playwright/test';

const createNewDashboardWithWidget = async (
  type: string,
  page: Page,
  browser: Browser,
  resourceExplorer?: ResourceExplorer
) => {
  const dashboard = new DashboardPage({ page, browser });
  await dashboard.goto();
  await dashboard.addAWidgetByType(type);
  await dashboard.makeViewportToAbsolute();

  if (resourceExplorer) {
    await resourceExplorer.addModeledProperties([MODELED_PROPERTY_NAME]);
  }
  return dashboard;
};
