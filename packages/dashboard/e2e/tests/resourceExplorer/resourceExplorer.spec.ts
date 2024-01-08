import { expect, test } from '../test';
import { gridUtil } from '../utils/grid';
import {
  ASSET_MODEL_TAB,
  MODELED_TAB,
  TEST_PAGE,
  UNMODELED_TAB,
  WIDGET_EMPTY_STATE_TEXT,
} from '../constants';
import { resourceExplorerUtil } from '../utils/resourceExplorer';

test('can load resource explorer', async ({ page }) => {
  await page.goto(TEST_PAGE);

  const resourceExplorer = resourceExplorerUtil(page);

  await resourceExplorer.open();

  await expect(page.locator(MODELED_TAB)).toBeVisible();
  await expect(page.locator(UNMODELED_TAB)).toBeVisible();
});

test('can load configure a widget with an asset model', async ({ page }) => {
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

  const {
    selectAssetModel,
    selectAsset,
    saveAssetModel,
    selectProperty,
    addToWidget,
  } = resourceExplorer.assetModelActions;
  // configure asset model and default asset and select
  await selectAssetModel('Site');
  await selectAsset('Africa site');
  await saveAssetModel();

  // select property on asset model and add to widget
  await selectProperty('Coordinates');
  await addToWidget();

  // check that widget is not in empty state
  await expect(page.getByText(WIDGET_EMPTY_STATE_TEXT)).not.toBeVisible();
  // check that property is visible in legend
  await expect(grid.gridArea().getByText('Coordinates')).toBeVisible();
});
