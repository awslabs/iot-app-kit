import { expect, test } from '@playwright/test';

const COMPONENT_SELECTOR = '#story-container';
const TEST_PAGE_STATUS_TIMELINE =
  '/iframe.html?args=&id=widgets-webgl-charts--status-timeline-example';

test('webgl-status-timeline', async ({ page }) => {
  await page.goto(TEST_PAGE_STATUS_TIMELINE);
  const chart = page.locator(COMPONENT_SELECTOR);
  await expect(chart).toContainText('2000');
  await expect(chart).toHaveScreenshot('status-timeline.png');
});
