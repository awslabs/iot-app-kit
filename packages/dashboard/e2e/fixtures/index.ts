import { test as base } from '@playwright/test';
import { SingleWidgetCustomDataSourceDashboardPage } from '../pages';

export { expect } from '@playwright/test';

type AppFixture = {
  singleWidgetCustomDataSourceDashboardPage: SingleWidgetCustomDataSourceDashboardPage;
};

/**
 * Defines admin and user pages for use in application tests.
 */
export const test = base.extend<AppFixture>({
  singleWidgetCustomDataSourceDashboardPage: async ({ browser }, use) => {
    await use(await SingleWidgetCustomDataSourceDashboardPage.create(browser));
  },
});
