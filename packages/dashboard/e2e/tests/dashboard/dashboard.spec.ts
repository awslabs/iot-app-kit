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

test('dashboard drag and drop text widget', async ({ page }) => {
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

test('dashboard resize, move, and select gestures', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const frame = page.locator(TEST_IFRAME); // Need to go into frame otherwise the `locator` won't locate the selection.

  const dragGenerator = dragAndDrop(page);

  // KPI will always show value shows value
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Component library');
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Time machine');

  const kpiWidget = page.getByRole('button', { name: 'add KPI widget' });
  const gridArea = page.locator('#container');

  const draggableWidget = dragGenerator(kpiWidget);

  // drag widget into 0, 0 position
  await draggableWidget.dragTo(gridArea, { targetPosition: ({ target: { x, y } }) => ({ x, y }) });

  // Placeholder text for kpi widget
  await expect(page.getByText('Add a property or alarm to populate KPI')).toBeVisible();

  const widget = page.locator('[data-gesture=widget]');
  const initialWidgetSize = await widget.boundingBox();
  const bottomRightAnchor = page.locator('[data-anchor=bottom-right]');

  // Drag to bottom right of grid to make it 1 cell bigger. dashboard size is 10 x 10
  await dragGenerator(bottomRightAnchor).dragTo(gridArea, {
    targetPosition: ({ source, target }) => ({ x: source.x + target.width / 10, y: source.y + target.height / 10 }),
  });

  const resizedWidget = await widget.boundingBox();
  if (!initialWidgetSize || !resizedWidget) throw new Error('Widget does not have a bounding box');

  // Widget should be bigger now
  await expect(resizedWidget.width).toBeGreaterThan(initialWidgetSize.width);
  await expect(resizedWidget.height).toBeGreaterThan(initialWidgetSize.height);

  // translate the widget down and right
  await dragGenerator(widget).dragTo(gridArea, {
    targetPosition: ({ source, target }) => ({
      x: source.x + source.width / 2 + target.width / 10,
      y: source.y + source.width / 2 + target.height / 10,
    }),
  });

  const translatedWidget = await widget.boundingBox();
  if (!initialWidgetSize || !translatedWidget) throw new Error('Widget does not have a bounding box');

  // Widget should be shifted now
  await expect(translatedWidget.x).toBeGreaterThan(initialWidgetSize.x);
  await expect(translatedWidget.y).toBeGreaterThan(initialWidgetSize.y);

  // click off the selection
  await dragGenerator(gridArea).dragTo(gridArea, {
    sourcePosition: ({ source }) => ({ x: source.x, y: source.y }),
    targetPosition: ({ target }) => ({ x: target.x + 1, y: target.y + 1 }),
  });

  await expect(bottomRightAnchor).not.toBeVisible();

  // Drag select the widget
  await dragGenerator(gridArea).dragTo(gridArea, {
    sourcePosition: ({ source }) => ({ x: source.x, y: source.y }),
    targetPosition: () => ({
      x: translatedWidget.x + translatedWidget.width,
      y: translatedWidget.y + translatedWidget.height,
    }),
  });

  await expect(bottomRightAnchor).toBeVisible();
});
