import { test, expect } from '@playwright/test';

const TEST_IFRAME = '#storybook-preview-iframe';
const COMPONENT_SELECTOR = '#story-container';
const TEST_PAGE_LINE_CHART = '/?path=/story/widgets-charts--line-chart-example';
const TEST_PAGE_SCATTER_CHART =
  '/?path=/story/widgets-charts--scatter-chart-example';
const TEST_PAGE_BAR_CHART = '/?path=/story/widgets-charts--bar-chart-example';
const TEST_PAGE_STATUS_TIMELINE =
  '/?path=/story/widgets-charts--status-timeline-example';

test('line-chart', async ({ page }) => {
  await page.goto(TEST_PAGE_LINE_CHART);
  const frame = page.frameLocator(TEST_IFRAME);
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('2000');
  await expect(frame.locator(COMPONENT_SELECTOR)).toHaveScreenshot(
    'line-chart.png'
  );
});

test('bar-chart', async ({ page }) => {
  await page.goto(TEST_PAGE_BAR_CHART);
  const frame = page.frameLocator(TEST_IFRAME);
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('2000');
  await expect(frame.locator(COMPONENT_SELECTOR)).toHaveScreenshot(
    'bar-chart.png'
  );
});

test('scatter-chart', async ({ page }) => {
  await page.goto(TEST_PAGE_SCATTER_CHART);
  const frame = page.frameLocator(TEST_IFRAME);
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('2000');
  await expect(frame.locator(COMPONENT_SELECTOR)).toHaveScreenshot(
    'scatter-chart.png'
  );
});

test('status-timeline', async ({ page }) => {
  await page.goto(TEST_PAGE_STATUS_TIMELINE);
  const frame = page.frameLocator(TEST_IFRAME);
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('2000');
  await expect(frame.locator(COMPONENT_SELECTOR)).toHaveScreenshot(
    'status-timeline.png'
  );
});
