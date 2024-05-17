import { test, expect } from '@playwright/test';

const TEST_PAGE = '/iframe.html?id=widgets-kpi--default-kpi';
const TEST_PAGE_HIDDEN_SETTINGS =
  '/iframe.html?id=widgets-kpi--kpi-hidden-settings';
const TEST_PAGE_THRESHOLD = '/iframe.html?id=widgets-kpi--kpi-thresholds';

test('kpi', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const KPIComponent = page.getByTestId('kpi-base-component');

  // screenshot comparison with everything showing
  await expect(KPIComponent).toHaveScreenshot('kpi-default-settings.png');
});

test('kpi hidden settings', async ({ page }) => {
  await page.goto(TEST_PAGE_HIDDEN_SETTINGS);
  const KPIComponent = page.getByTestId('kpi-base-component');

  // screenshot comparison with everything hidden
  await expect(KPIComponent).toHaveScreenshot('kpi-hidden-settings.png');
});

test('kpi with thresholds', async ({ page }) => {
  await page.goto(TEST_PAGE_THRESHOLD);
  const AllKPIs = page.getByTestId('mock-data-kpi-story');

  // screenshot comparison
  await expect(AllKPIs).toHaveScreenshot('kpi-with-thresholds.png');
});
