import { test, expect } from '@playwright/test';

const COMPONENT_SELECTOR = '#story-container';
const TEST_PAGE_LINE_CHART =
  '/iframe.html?id=widgets-webgl-charts--line-chart-example';
const TEST_PAGE_BAR_CHART =
  '/iframe.html?id=widgets-webgl-charts--bar-chart-example';
const TEST_PAGE_SCATTER_CHART =
  '/iframe.html?id=widgets-webgl-charts--scatter-chart-example';
const TEST_PAGE_STATUS_TIMELINE =
  '/iframe.html?id=widgets-webgl-charts--status-timeline-example';

test('webgl-line-chart', async ({ page }) => {
  await page.goto(TEST_PAGE_LINE_CHART);
  const chart = page.locator(COMPONENT_SELECTOR);
  await expect(chart).toContainText('2000');
  await expect(chart).toHaveScreenshot('line-chart.png');
});

test('webgl-bar-chart', async ({ page }) => {
  await page.goto(TEST_PAGE_BAR_CHART);
  const chart = page.locator(COMPONENT_SELECTOR);
  await expect(chart).toContainText('2000');
  await expect(chart).toHaveScreenshot('bar-chart.png');
});

test('webgl-scatter-chart', async ({ page }) => {
  await page.goto(TEST_PAGE_SCATTER_CHART);
  const chart = page.locator(COMPONENT_SELECTOR);
  await expect(chart).toContainText('2000');
  await expect(chart).toHaveScreenshot('scatter-chart.png');
});

test('webgl-status-timeline', async ({ page }) => {
  await page.goto(TEST_PAGE_STATUS_TIMELINE);
  const chart = page.locator(COMPONENT_SELECTOR);
  await expect(chart).toContainText('2000');
  await expect(chart).toHaveScreenshot('status-timeline.png');
});
