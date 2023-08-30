import { test, expect } from '@playwright/test';
import { dragAndDrop } from '../utils/dragAndDrop';
import { GRID_SIZE, gridUtil } from '../utils/grid';
import { getBoundingBox } from '../utils/locator';

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

  const grid = gridUtil(page);

  // KPI will always show value shows value
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Component library');
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Time machine');

  const location1 = await grid.cellLocation(0, 0);

  // drag widget into 0, 0 position
  const widget = await grid.addWidget('kpi', () => location1);

  // Placeholder text for kpi widget
  await expect(page.getByText('Add a property or alarm to populate KPI')).toBeVisible();

  const initialWidgetBoundingBox = await getBoundingBox(widget);

  // Drag to bottom right of grid to make it 1 cell bigger. dashboard size is 10 x 10
  await grid.resizeSelection('bottom-right', ({ source, target }) => ({
    x: source.x + target.width / GRID_SIZE,
    y: source.y + target.height / GRID_SIZE,
  }));

  const resizedWidgetBoundingBox = await getBoundingBox(widget);

  // Widget should be bigger now
  await expect(resizedWidgetBoundingBox.width).toBeGreaterThan(initialWidgetBoundingBox.width);
  await expect(resizedWidgetBoundingBox.height).toBeGreaterThan(initialWidgetBoundingBox.height);

  // translate the widget down and right
  await grid.moveSelection(({ source, target }) => ({
    x: source.x + source.width / 2 + target.width / GRID_SIZE,
    y: source.y + source.width / 2 + target.height / GRID_SIZE,
  }));

  const translatedWidgetBoundingBox = await getBoundingBox(widget);

  // Widget should be shifted now
  await expect(translatedWidgetBoundingBox.x).toBeGreaterThan(initialWidgetBoundingBox.x);
  await expect(translatedWidgetBoundingBox.y).toBeGreaterThan(initialWidgetBoundingBox.y);

  await grid.clearSelection();

  await expect(grid.selection()).not.toBeVisible();

  // Select the widget
  await grid.clickWidget(widget);

  await expect(grid.selection()).toBeVisible();
});

test('dashboard add and remove multiple widgets', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const frame = page.locator(TEST_IFRAME); // Need to go into frame otherwise the `locator` won't locate the selection.

  const grid = gridUtil(page);

  // KPI will always show value shows value
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Component library');
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Time machine');

  const location1 = await grid.cellLocation(0, 0);
  const location2 = await grid.cellLocation(5, 0);
  const location3 = await grid.cellLocation(0, 3);
  const location4 = await grid.cellLocation(5, 3);

  // Make a kpi grid
  await grid.addWidget('kpi', () => location1);
  await grid.addWidget('kpi', () => location2);
  await grid.addWidget('kpi', () => location3);
  await grid.addWidget('kpi', () => location4);

  const addedWidgets = await grid.widgets();
  expect(addedWidgets).toHaveLength(4);

  await grid.selectAll();

  await page.keyboard.down('Delete');

  const deletedWidgets = await grid.widgets();
  expect(deletedWidgets).toHaveLength(0);
});
