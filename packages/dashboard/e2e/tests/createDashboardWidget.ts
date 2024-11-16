import { type Browser, type Page } from '@playwright/test';
import { DashboardPage } from './dashboard/DashboardPage';
import { type ResourceExplorer } from './resourceExplorer/ResourceExplorer';

const MODELED_PROPERTY_NAME = 'Max Temperature';

export const createNewDashboardWithWidget = async (
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
