import { expect, test } from '@playwright/test';
import { componentAssetModelName } from '../../../../../packages/data-mocked/src/iot-sitewise/resources/assetModels';
import {
  ASSET_MODEL_TAB,
  MODELED_TAB,
  TEST_PAGE,
  UNMODELED_TAB,
  WIDGET_EMPTY_STATE_TEXT,
} from '../constants';
import { gridUtil } from '../utils/grid';
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

  const { addToWidget } = resourceExplorer.generalActions;
  const { selectAssetModel, selectAsset, saveAssetModel, selectProperty } =
    resourceExplorer.assetModelActions;
  // configure asset model and default asset and select
  await selectAssetModel('Production Site Asset Model');
  await selectAsset('Africa site');
  await saveAssetModel();

  // select property on asset model and add to widget
  await selectProperty('Production Rate');
  await addToWidget();

  // check that widget is not in empty state
  await expect(page.getByText(WIDGET_EMPTY_STATE_TEXT)).not.toBeVisible();
  // check that property is visible in legend
  await expect(grid.gridArea().getByText('Production Rate')).toBeVisible();
});

test('properties are disabled and enabled according to their data type', async ({
  page,
}) => {
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
    findProperty,
    findDisabledProperty,
  } = resourceExplorer.assetModelActions;

  // configure asset model and default asset and select
  await selectAssetModel('Production Site Asset Model');
  await selectAsset('Africa site');
  await saveAssetModel();

  // check that number property is not disabled
  const validProperty = findProperty('Production Rate');
  await expect(validProperty).not.toBeDisabled();

  // check that string property is disabled
  const invalidProperty = findDisabledProperty('STRING');
  await expect(invalidProperty).toBeDisabled();
});

//modeled data streams tests
test('properties are disabled and enabled according to their data type (modeled)', async ({
  page,
}) => {
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

  // open resource explorer and tab to Modeled
  await resourceExplorer.open();
  await expect(page.locator(MODELED_TAB)).toBeVisible();
  await resourceExplorer.tabTo('modeled');

  const {
    findAsset,
    selectAsset,
    findProperty,
    selectProperty,
    findDisabledProperty,
  } = resourceExplorer.modeledActions;

  //find and click asset
  await findAsset('Africa Site');
  await selectAsset('Africa Site');

  //find string property and check disabled (double click to move screen down)
  await selectProperty('Production Rate');
  await selectProperty('Production Rate');

  // check that number property is not disabled
  const validProperty = findProperty('Production Rate');
  await expect(validProperty).not.toBeDisabled();

  // check that string property is disabled
  const invalidProperty = findDisabledProperty('STRING');
  await expect(invalidProperty).toBeDisabled();
});

test('changing selected asset and returning back to old asset resets selection (modeled)', async ({
  page,
}) => {
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

  // open resource explorer and tab to Modeled
  await resourceExplorer.open();
  await expect(page.locator(MODELED_TAB)).toBeVisible();
  await resourceExplorer.tabTo('modeled');

  const { findAsset, selectAsset, findProperty, selectProperty } =
    resourceExplorer.modeledActions;

  //find and click asset
  await findAsset('Africa Site');
  await selectAsset('Africa Site');

  //select property and see if it is selected
  await selectProperty('Production Rate');
  const checkedProperty = findProperty('Production Rate');
  await expect(checkedProperty).toBeChecked();

  //find another asset and click
  await findAsset('Asia Site');
  await selectAsset('Asia Site');

  //find and click original asset
  await findAsset('Africa Site');
  await selectAsset('Africa Site');

  await expect(checkedProperty).not.toBeChecked();
});

test(' adding properties to widget clears selection on resource explorer (modeled)', async ({
  page,
}) => {
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

  // open resource explorer and tab to Modeled
  await resourceExplorer.open();
  await expect(page.locator(MODELED_TAB)).toBeVisible();
  await resourceExplorer.tabTo('modeled');

  const { addToWidget } = resourceExplorer.generalActions;

  const { findAsset, selectAsset, findProperty, selectProperty } =
    resourceExplorer.modeledActions;

  //find and click asset
  await findAsset('Africa Site');
  await selectAsset('Africa Site');

  //select property
  await selectProperty('Production Rate');
  const checkedProperty = findProperty('Production Rate');
  await expect(checkedProperty).toBeChecked();

  //add selected properties to widget
  await addToWidget();

  // check that widget is not in empty state
  await expect(page.getByText(WIDGET_EMPTY_STATE_TEXT)).not.toBeVisible();
  // check that property is visible in legend
  await expect(grid.gridArea().getByText('Production Rate')).toBeVisible();

  //properties are not selected anymore
  await expect(checkedProperty).not.toBeChecked();
});

test(' changing widgets filters properties correctly (modeled)', async ({
  page,
}) => {
  await page.goto(TEST_PAGE);

  const grid = gridUtil(page);
  const resourceExplorer = resourceExplorerUtil(page);

  // add line widget
  const location1 = await grid.cellLocation(0, 0);
  const location2 = await grid.cellLocation(0, 0);
  const lineWidget = await grid.addWidget('line', () => location1);
  const kpiWidget = await grid.addWidget('kpi', () => location2);

  // select line widget
  await grid.clickWidget(lineWidget);

  // check that widget is in empty state
  await expect(page.getByText(WIDGET_EMPTY_STATE_TEXT)).toBeVisible();

  // open resource explorer and tab to Modeled
  await resourceExplorer.open();
  await expect(page.locator(MODELED_TAB)).toBeVisible();
  await resourceExplorer.tabTo('modeled');

  const { findAsset, selectAsset, findProperty, findDisabledProperty } =
    resourceExplorer.modeledActions;

  //find and click asset
  await findAsset('Africa Site');
  await selectAsset('Africa Site');

  // check integer property not disabled
  const validProperty = findProperty('Production Rate');
  await expect(validProperty).not.toBeDisabled();

  //find string property and check disabled
  const invalidProperty = findDisabledProperty('STRING');
  await expect(invalidProperty).toBeDisabled();

  // select kpi widget
  await grid.clickWidget(kpiWidget);

  const validProperty2 = findProperty('Coordinates');

  // check integer property is not disabled
  await expect(validProperty).not.toBeDisabled();

  //find string property is not disabled
  await expect(validProperty2).not.toBeDisabled();
});

test('filters COMPONENT_MODEL from asset model results', async ({ page }) => {
  await page.goto(TEST_PAGE);

  const resourceExplorer = resourceExplorerUtil(page);

  await resourceExplorer.open();

  await expect(page.locator(MODELED_TAB)).toBeVisible();
  await expect(page.locator(UNMODELED_TAB)).toBeVisible();
  await expect(page.locator(ASSET_MODEL_TAB)).toBeVisible();

  await resourceExplorer.tabTo('assetModel');

  await page.getByLabel('Asset model', { exact: true }).click();
  const searchBox = await page.getByPlaceholder('Filter asset models');
  await searchBox.click();
  await searchBox.fill(componentAssetModelName);

  // check that composite model does not show up
  await expect(page.getByText(componentAssetModelName)).not.toBeVisible();
});
