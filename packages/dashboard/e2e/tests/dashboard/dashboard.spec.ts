import { test, expect } from '@playwright/test';
import { dragAndDrop } from '../utils/dragAndDrop';

const TEST_PAGE = 'http://localhost:6006/iframe.html?id=dashboard-mocked-data--empty';
const TEST_IFRAME = '#root';
const COMPONENT_SELECTOR = '.dashboard';

test('dashboard', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const frame = page.locator(TEST_IFRAME); // Need to go into frame otherwise the `locator` won't locate the selection.

  // KPI will always show value shows value
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Component library');
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Time machine');
});

test('dashboard drag and drop', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const frame = page.locator(TEST_IFRAME); // Need to go into frame otherwise the `locator` won't locate the selection.

  const dragGenerator = dragAndDrop(page);

  // KPI will always show value shows value
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Component library');
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Time machine');

  const textWidget = page.getByRole('button', { name: 'add Text widget' });
  const gridArea = page.locator('#container');

  const draggableTextWidget = dragGenerator(textWidget);

  await draggableTextWidget.dragTo(gridArea);

  await expect(page.getByPlaceholder('Add text')).toBeVisible();
});
