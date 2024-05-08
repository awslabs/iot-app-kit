import { test, expect } from '@playwright/test';

const TEST_PAGE = '/iframe.html?id=widgets-base-chart--default-base-chart';

test('line chart default settings', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const LineChart = page.getByTestId('base-chart-container');

  // screenshot comparison with everything showing
  await expect(LineChart).toHaveScreenshot('line-chart-default-settings.png');
});
