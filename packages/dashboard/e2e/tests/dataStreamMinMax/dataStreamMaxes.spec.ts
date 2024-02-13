import { test, expect, Page } from '@playwright/test';
import {
  MODELED_TAB,
  TEST_PAGE,
  WIDGET_EMPTY_STATE_TEXT,
  MAX_VALUE_TABLE_HEADER,
  MAX_TABLE_CELL,
} from '../constants';
import { gridUtil } from '../utils/grid';
import { resourceExplorerUtil } from '../utils/resourceExplorer';

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
  await expect(page.locator(MODELED_TAB)).toBeVisible();
  await resourceExplorer.tabTo('modeled');

  const { selectAsset, selectProperty } = resourceExplorer.modeledActions;
  const { addToWidget } = resourceExplorer.generalActions;
  await selectAsset('Africa site');
  // select property on asset model and add to widget
  await selectProperty('Production Rate');
  await addToWidget();

  await expect(grid.gridArea().getByText('Production Rate')).toBeVisible();
  return lineWidget;
};

test('max value is present', async ({ page }) => {
  const lineWidget = await setupTest(page);

  const bounds = await lineWidget.boundingBox();

  if (!bounds) {
    throw new Error('Line widget has no bounds');
  }

  // cloudscape table makes 2 instances of the header
  await expect(page.getByTestId(MAX_VALUE_TABLE_HEADER)).toHaveCount(2);

  // pause for data load + echarts lifecycle to re-render
  await page.waitForTimeout(2000);

  const updatedMaxValueString = await page
    .getByTestId(MAX_TABLE_CELL)
    .first()
    .innerText();

  expect(updatedMaxValueString).not.toEqual('-');
});
