import { test, expect, Page, Locator } from '@playwright/test';
import { parse } from 'date-fns';
import {
  ADD_TREND_CURSOR,
  ASSET_MODEL_TAB,
  PREVIEW_BUTTON_SELECTOR,
  REMOVE_TREND_CURSOR,
  TEST_PAGE,
  TREND_CURSOR_TABLE_CELL,
  TREND_CURSOR_TABLE_HEADER,
  WIDGET_EMPTY_STATE_TEXT,
} from '../constants';
import { gridUtil } from '../utils/grid';
import { resourceExplorerUtil } from '../utils/resourceExplorer';
import { dragAndDrop } from '../utils/dragAndDrop';

const setupTest = async (page: Page) => {
  await page.goto(TEST_PAGE);

  const grid = gridUtil(page);
  const resourceExplorer = resourceExplorerUtil(page);

  // add line widget
  const location1 = await grid.cellLocation(0, 0);
  const lineWidget = await grid.addWidget('line', () => location1);

  // select line widget
  await grid.clickWidget(lineWidget);

  // check that widget is in empty state
  await expect(page.getByText(WIDGET_EMPTY_STATE_TEXT)).toBeVisible();

  // open resource explorer and tab to asset model tab
  await resourceExplorer.open();
  await expect(page.locator(ASSET_MODEL_TAB)).toBeVisible();
  await resourceExplorer.tabTo('assetModel');

  const { selectAssetModel, selectAsset, saveAssetModel, selectProperty } =
    resourceExplorer.assetModelActions;
  const { addToWidget } = resourceExplorer.generalActions;
  // configure asset model and default asset and select
  await selectAssetModel('Site');
  await selectAsset('Africa site');
  await saveAssetModel();

  // select property on asset model and add to widget
  await selectProperty('Production Rate');
  await addToWidget();

  await expect(grid.gridArea().getByText('Production Rate')).toBeVisible();
  return lineWidget;
};

const addTrendCursor = async ({
  page,
  lineWidget,
}: {
  page: Page;
  lineWidget: Locator;
}) => {
  await lineWidget.click({
    button: 'right',
  });
  await page.getByText(ADD_TREND_CURSOR).click();
};

const removeTrendCursor = async ({
  page,
  lineWidget,
}: {
  page: Page;
  lineWidget: Locator;
}) => {
  await lineWidget.click({
    button: 'right',
  });
  await page.getByText(REMOVE_TREND_CURSOR).click();
};

test('can add and remove a trend cursor', async ({ page }) => {
  const lineWidget = await setupTest(page);

  const bounds = await lineWidget.boundingBox();

  if (!bounds) {
    throw new Error('Line widget has no bounds');
  }

  await addTrendCursor({ page, lineWidget });

  // cloudscape table makes 2 instances of the header
  await expect(page.locator(TREND_CURSOR_TABLE_HEADER)).toHaveCount(2);

  await removeTrendCursor({ page, lineWidget });

  // wait for the table to update to have no headers
  await expect(page.locator(TREND_CURSOR_TABLE_HEADER)).toHaveCount(0);
});

test('can add and remove multiple trend cursors', async ({ page }) => {
  const lineWidget = await setupTest(page);

  const bounds = await lineWidget.boundingBox();

  if (!bounds) {
    throw new Error('Line widget has no bounds');
  }

  await addTrendCursor({ page, lineWidget });
  await addTrendCursor({ page, lineWidget });
  await addTrendCursor({ page, lineWidget });

  // cloudscape table makes 2 instances of the header
  await expect(page.locator(TREND_CURSOR_TABLE_HEADER)).toHaveCount(6);

  await removeTrendCursor({ page, lineWidget });

  await expect(page.locator(TREND_CURSOR_TABLE_HEADER)).toHaveCount(4);

  await removeTrendCursor({ page, lineWidget });

  await expect(page.locator(TREND_CURSOR_TABLE_HEADER)).toHaveCount(2);

  await removeTrendCursor({ page, lineWidget });

  // wait for the table to update to have no headers
  await expect(page.locator(TREND_CURSOR_TABLE_HEADER)).toHaveCount(0);
});

test('can drag a trend cursor', async ({ page }) => {
  const dragGenerator = dragAndDrop(page);

  const lineWidget = await setupTest(page);

  await page
    .getByTestId('dashboard-actions')
    .getByText(PREVIEW_BUTTON_SELECTOR)
    .click();

  // change the viewport so that the trend cursors remain stationary
  await page
    .getByRole('button', {
      name: 'Move backward',
    })
    .click();

  await addTrendCursor({ page, lineWidget });

  // cloudscape table makes 2 instances of the header
  await expect(page.locator(TREND_CURSOR_TABLE_HEADER)).toHaveCount(2);

  const initialTrendCursorDateString = await page
    .locator(TREND_CURSOR_TABLE_HEADER)
    .first()
    .innerText();
  const initialTrendCursorValueString = await page
    .locator(TREND_CURSOR_TABLE_CELL)
    .first()
    .innerText();

  // wait for the interval to resolve
  await page.waitForTimeout(2000);

  // trend cursor should have some value
  expect(initialTrendCursorValueString).not.toEqual('-');

  await dragGenerator(lineWidget).dragTo(lineWidget, {
    targetPosition: ({ target }) => ({
      x: target.x + target.width * 0.25,
      y: target.y,
    }),
  });

  // wait for the interval to resolve on the trendcursor update
  await page.waitForTimeout(2000);

  const updatedTrendCursorDateString = await page
    .locator(TREND_CURSOR_TABLE_HEADER)
    .first()
    .innerText();
  const updatedTrendCursorValueString = await page
    .locator(TREND_CURSOR_TABLE_CELL)
    .first()
    .innerText();

  expect(initialTrendCursorDateString).not.toEqual(
    updatedTrendCursorDateString
  );
  const initialDate = parse(
    `${initialTrendCursorDateString.split('\n').join(' ')}`,
    'dd/MM/yyyy HH:mm:ss',
    new Date()
  );
  const updatedDate = parse(
    `${updatedTrendCursorDateString.split('\n').join(' ')}`,
    'dd/MM/yyyy HH:mm:ss',
    new Date()
  );
  expect(initialDate.getTime()).toBeGreaterThan(updatedDate.getTime());

  // trend cursor should have some value
  // mock values are random so checking equality could result in a flakey test even though very unlikely
  expect(updatedTrendCursorValueString).not.toEqual('-');

  await removeTrendCursor({ page, lineWidget });
  // wait for the table to update to have no headers
  await expect(page.locator(TREND_CURSOR_TABLE_HEADER)).toHaveCount(0);
});
