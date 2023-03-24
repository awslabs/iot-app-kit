import { test, expect } from '@playwright/test';

const TEST_PAGE = 'http://localhost:6006/?path=/story/dashboard-mocked-data--empty';
const TEST_IFRAME = '#storybook-preview-iframe';
const COMPONENT_SELECTOR = '.dashboard';

test('dashboard', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const frame = page.frameLocator(TEST_IFRAME); // Need to go into frame otherwise the `locator` won't locate the selection.

  // KPI will always show value shows value
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Component library');
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Time machine');
});
