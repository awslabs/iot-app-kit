import { test, expect } from '@playwright/test';

const TEST_PAGE = 'http://localhost:6006/?path=/story/dashboard-mocked-data--empty';
const TEST_IFRAME = '#storybook-preview-iframe';
const COMPONENT_SELECTOR = '.iot-dashboard';

test('dashboard', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const frame = page.frameLocator(TEST_IFRAME); // Need to go into frame otherwise the `locator` won't locate the selection.

  // KPI will always show value shows value
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Component Library');
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Time Machine');
  await expect(frame.locator(COMPONENT_SELECTOR)).toHaveScreenshot('empty.png');
});
