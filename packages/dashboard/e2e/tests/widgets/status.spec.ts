import { DashboardPage } from '../dashboard/DashboardPage';
import { test, expect } from '@playwright/test';

test.describe('Test Status Widget', () => {
  test('Status widget cannot be added to the dashboard', async ({
    page,
    browser,
  }) => {
    const dashboard = new DashboardPage({ page, browser });
    await dashboard.goto();
    expect(await dashboard.widgetPalette.allTextContents()).not.toContain(
      'Status'
    );
  });
});
