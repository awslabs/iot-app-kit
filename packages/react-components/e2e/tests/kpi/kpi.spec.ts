import { test, expect } from '@playwright/test';

const TEST_PAGE = 'http://localhost:6007/?path=/story/widgets-kpi-kpi-base--main';
const TEST_IFRAME = '#storybook-preview-iframe';
const COMPONENT_SELECTOR = '.kpi';

test('kpi', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const frame = page.frameLocator(TEST_IFRAME); // Need to go into frame otherwise the `locator` won't locate the selection.

  // KPI will always show value shows value
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('100');
  await expect(frame.locator(COMPONENT_SELECTOR)).toHaveScreenshot('default.png');
});
