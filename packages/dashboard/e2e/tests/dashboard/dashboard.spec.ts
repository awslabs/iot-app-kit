import { test, expect } from '@playwright/test';
import { dragAndDrop } from '../utils/dragAndDrop';
import { GRID_SIZE, gridUtil } from '../utils/grid';
import { getBoundingBox } from '../utils/locator';
import {
  COMPONENT_SELECTOR,
  MODELED_TAB,
  TEST_IFRAME,
  TEST_PAGE,
  WIDGET_EMPTY_STATE_TEXT,
} from '../constants';
import { resourceExplorerUtil } from '../utils/resourceExplorer';

test('dashboard', async ({ page }) => {
  await page.goto(TEST_PAGE);

  await expect(page.getByTestId('time-selection')).toBeVisible();
});

// TODO: fix these tests (failure due to stetchToFit removal from dashboard)
test.skip('dashboard drag and drop text widget', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const frame = page.locator(TEST_IFRAME); // Need to go into frame otherwise the `locator` won't locate the selection.

  const dragGenerator = dragAndDrop(page);

  // KPI will always show value shows value
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Time machine');

  const textWidget = page.getByRole('button', { name: 'add Text widget' });
  const gridArea = page.locator('#container');

  const draggableTextWidget = dragGenerator(textWidget);

  await draggableTextWidget.dragTo(gridArea);

  await expect(page.getByPlaceholder('Add text')).toBeVisible();
});

// TODO: fix these tests (failure due to stetchToFit removal from dashboard)
test.skip('dashboard resize, move, and select gestures', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const frame = page.locator(TEST_IFRAME); // Need to go into frame otherwise the `locator` won't locate the selection.

  const grid = gridUtil(page);

  // KPI will always show value shows value
  await expect(frame.locator(COMPONENT_SELECTOR)).toContainText('Time machine');

  const location1 = await grid.cellLocation(0, 0);

  // drag widget into 0, 0 position
  const widget = await grid.addWidget('kpi', () => location1);

  // Placeholder text for kpi widget
  await expect(
    page.getByText('Add a property or alarm to populate KPI.')
  ).toBeVisible();

  const initialWidgetBoundingBox = await getBoundingBox(widget);

  // Drag to bottom right of grid to make it 1 cell bigger. dashboard size is 10 x 10
  await grid.resizeSelection('bottom-right', ({ source, target }) => ({
    x: source.x + target.width / GRID_SIZE,
    y: source.y + target.height / GRID_SIZE,
  }));

  const resizedWidgetBoundingBox = await getBoundingBox(widget);

  // Widget should be bigger now
  await expect(resizedWidgetBoundingBox.width).toBeGreaterThan(
    initialWidgetBoundingBox.width
  );
  await expect(resizedWidgetBoundingBox.height).toBeGreaterThan(
    initialWidgetBoundingBox.height
  );

  // translate the widget down and right
  await grid.moveSelection(({ source, target }) => ({
    x: source.x + source.width / 2 + target.width / GRID_SIZE,
    y: source.y + source.width / 2 + target.height / GRID_SIZE,
  }));

  const translatedWidgetBoundingBox = await getBoundingBox(widget);

  // Widget should be shifted now
  await expect(translatedWidgetBoundingBox.x).toBeGreaterThan(
    initialWidgetBoundingBox.x
  );
  await expect(translatedWidgetBoundingBox.y).toBeGreaterThan(
    initialWidgetBoundingBox.y
  );

  await grid.clearSelection();

  await expect(grid.selection()).not.toBeVisible();

  // Select the widget
  await grid.clickWidget(widget);

  await expect(grid.selection()).toBeVisible();
});

test('dashboard add and remove multiple widgets', async ({ page }) => {
  await page.goto(TEST_PAGE);

  const grid = gridUtil(page);

  const location1 = await grid.cellLocation(0, 0);
  const location2 = await grid.cellLocation(1, 0);
  const location3 = await grid.cellLocation(0, 1);
  const location4 = await grid.cellLocation(2, 0);

  // Make a kpi grid
  await grid.addWidget('kpi', () => location1);
  await grid.addWidget('kpi', () => location2);
  await grid.addWidget('kpi', () => location3);
  await grid.addWidget('kpi', () => location4);

  const addedWidgets = await grid.widgets();
  expect(addedWidgets).toHaveLength(4);

  await grid.selectAll();

  await page.keyboard.down('Delete');

  const deleteBtn = await page.getByRole('button', {
    name: 'Delete',
    exact: true,
  });

  await deleteBtn.click();

  const deletedWidgets = await grid.widgets();
  expect(deletedWidgets).toHaveLength(0);
});

test('pagination buttons', async ({ page }) => {
  await page.goto(TEST_PAGE);

  await expect(page.getByTestId('time-selection')).toBeVisible();

  const forwardBtn = await page.getByRole('button', {
    name: /paginate-foward/i,
  });
  await expect(page.getByTestId('time-selection')).toBeVisible();

  const backBtn = await page.getByRole('button', {
    name: /paginate-backward/i,
  });

  expect(forwardBtn);
  expect(backBtn);
});

test('dashboard viewport gestures', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const resourceExplorer = resourceExplorerUtil(page);

  const grid = gridUtil(page);

  const location1 = await grid.cellLocation(0, 0);

  // drag widget into 0, 0 position
  const widget = await grid.addWidget('line', () => location1);

  // check that widget is in empty state
  await expect(page.getByText(WIDGET_EMPTY_STATE_TEXT)).toBeVisible();
  const initialWidgetBoundingBox = await getBoundingBox(widget);

  // open resource explorer and tab to asset model tab
  await resourceExplorer.open();
  await expect(page.locator(MODELED_TAB)).toBeVisible();
  await resourceExplorer.tabTo('modeled');

  const { selectAsset, selectProperty } = resourceExplorer.modeledActions;
  const { addToWidget } = resourceExplorer.generalActions;
  await selectAsset('Africa site');

  // select property on asset model and add to widget
  await selectProperty('Production Rate');
  await addToWidget();

  await expect(grid.gridArea().getByText('Production Rate')).toBeVisible();

  // check viewport is the default last 10 minutes before dragging
  await expect(page.getByLabel('Time range')).toContainText('Last 10 minutes');

  // gesture to change viewport
  const { x, y, width, height } = initialWidgetBoundingBox;
  await page.keyboard.down('Shift');
  await page.mouse.move(x + width / 2, y + height / 2);
  await page.mouse.down();
  await page.mouse.move(x + width / 2 + 50, y + height / 2 + 50);
  await page.mouse.up();

  // after gesture, viewport should have an absolute viewport and not say "last 10 minutes"
  await expect(page.getByLabel('Time range')).not.toContainText(
    'Last 10 minutes'
  );
});
