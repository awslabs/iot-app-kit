import { test, expect } from '@playwright/test';
import { getDecimalPlaces } from '../utils/getDecimalPlaces';
import { NEW_PROPERTY_NAME } from '../constants';
import { createNewDashboardWithWidget } from '../createDashboardWidget';
import { ResourceExplorer } from '../resourceExplorer/ResourceExplorer';
import { ConfigPanel } from '../configPanel/ConfigPanel';

test.describe('Test KPI Widget', () => {
  test('KPI widget can be added to the dashboard', async ({
    page,
    browser,
  }) => {
    const dashboardWithKPIWidget = await createNewDashboardWithWidget(
      'kpi',
      page,
      browser
    );
    const widgetEmptyState = dashboardWithKPIWidget.gridArea.locator(
      '.kpi-widget-empty-state'
    );
    await expect(widgetEmptyState).toBeVisible();
  });

  test('Can add property to KPI widget', async ({ page, browser }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithKPIWidget = await createNewDashboardWithWidget(
      'kpi',
      page,
      browser
    );
    await resourceExplorer.addModeledProperties(['Max Temperature']);
    const widget =
      dashboardWithKPIWidget.gridArea.getByTestId('kpi-base-component');
    expect(await widget.textContent()).toContain('Max Temperature');
  });

  test('Cannot add more than 1 property to KPI widget', async ({
    page,
    browser,
  }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithKPIWidget = await createNewDashboardWithWidget(
      'kpi',
      page,
      browser
    );
    //add property
    await resourceExplorer.addModeledProperties(['Max Temperature']);
    dashboardWithKPIWidget.gridArea.getByTestId('kpi-base-component');
    //select 2 more properties
    await resourceExplorer.selectProperties(['Min Temperature', 'Temperature']);

    //check that add button is disabled
    const addButton = await resourceExplorer.getAddButton();
    await expect(addButton).toBeDisabled();
  });

  test('Cannot multiselect add property to KPI widget', async ({
    page,
    browser,
  }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithKPIWidget = await createNewDashboardWithWidget(
      'kpi',
      page,
      browser
    );
    //select 3 properties
    await resourceExplorer.addModeledProperties([
      'Min Temperature',
      'Max Temperature',
    ]);
    dashboardWithKPIWidget.gridArea.locator('.kpi-widget-empty-state');
    const widget =
      dashboardWithKPIWidget.gridArea.getByTestId('kpi-base-component');
    expect(await widget.textContent()).toContain('Max Temperature');
    expect(await widget.textContent()).not.toContain('Min Temperature');
  });

  test('KPI Widget supports show/hide several properties', async ({
    page,
    browser,
  }) => {
    const configPanel = new ConfigPanel({ page });
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithKPIWidget = await createNewDashboardWithWidget(
      'kpi',
      page,
      browser
    );
    // add property
    await resourceExplorer.addModeledProperties(['Max Temperature']);

    const nameAndUnit =
      dashboardWithKPIWidget.gridArea.getByTestId('kpi-name-and-unit');
    const timestamp =
      dashboardWithKPIWidget.gridArea.getByTestId('kpi-timestamp');
    const aggregationAndResolution =
      dashboardWithKPIWidget.gridArea.getByTestId('kpi-aggregation');
    const value = dashboardWithKPIWidget.gridArea.getByTestId('kpi-value');

    // verify that all values are initially visible
    await expect(nameAndUnit).toBeVisible();
    await expect(timestamp).toBeVisible();
    await expect(aggregationAndResolution).toBeVisible();
    await expect(value).toBeVisible();

    // open config panel
    await configPanel.collapsedButton.click();
    await configPanel.showHideName.click();
    await configPanel.showHideUnit.click();
    await configPanel.showHideTimestamp.click();
    await configPanel.showHideAggregationResolution.click();

    // verify that no values are visible other than the data point
    await expect(nameAndUnit).toBeHidden();
    await expect(timestamp).toBeHidden();
    await expect(aggregationAndResolution).toBeHidden();
    await expect(value).toBeVisible();
  });

  test('KPI Widget supports significant digits', async ({ page, browser }) => {
    const configPanel = new ConfigPanel({ page });
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithKPIWidget = await createNewDashboardWithWidget(
      'kpi',
      page,
      browser
    );

    // add property
    await resourceExplorer.addModeledProperties(['Max Temperature']);

    //verify that initial value is not rounded
    const widgetValue = await dashboardWithKPIWidget.gridArea
      .getByTestId('kpi-value')
      .textContent();
    expect(getDecimalPlaces(widgetValue)).toBe(4);

    //change sig digits to 1
    await configPanel.collapsedButton.click();
    await configPanel.decimalPlaceInput.fill('1');

    //confirm that value has one decimal place
    const updatedWidgetValue = await dashboardWithKPIWidget.gridArea
      .getByTestId('kpi-value')
      .textContent();
    expect(getDecimalPlaces(updatedWidgetValue)).toBe(1);
  });

  test('KPI Widget supports thresholds', async ({ page, browser }) => {
    const configPanel = new ConfigPanel({ page });
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithKPIWidget = await createNewDashboardWithWidget(
      'kpi',
      page,
      browser
    );
    // add a property
    await resourceExplorer.addModeledProperties(['Max Temperature']);

    // open threshold panel
    await configPanel.collapsedButton.click();
    await configPanel.container
      .getByRole('tab', {
        name: 'Thresholds',
        exact: true,
      })
      .click();

    // add a threshold
    await configPanel.container
      .getByRole('button', {
        name: 'Add a threshold',
        exact: true,
      })
      .click();
    await page.waitForTimeout(1000);
    const thresholdDisplay = configPanel.container.locator(
      'div[class="threshold-display"]'
    );
    await thresholdDisplay
      .locator('div[class="threshold-configuration"]')
      .locator('button')
      .first()
      .click();
    await page.keyboard.down('ArrowDown');
    await page.keyboard.down('Enter');

    await configPanel.container.getByPlaceholder('Threshold value').fill('1');
    await thresholdDisplay.getByLabel('color picker').fill('#f63804');

    const widgetValue =
      dashboardWithKPIWidget.gridArea.getByTestId('kpi-value');
    await expect(widgetValue).toHaveCSS('color', 'rgb(255, 255, 255)');
  });

  test('KPI widget can change label', async ({ page, browser }) => {
    const configPanel = new ConfigPanel({ page });
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithKPIWidget = await createNewDashboardWithWidget(
      'kpi',
      page,
      browser
    );

    //add property and open config panel
    await resourceExplorer.addModeledProperties(['Max Temperature']);
    await configPanel.collapsedButton.click();
    await configPanel.propertiesTab.click();

    // wait one second for config panel to load
    await page.waitForTimeout(1000);

    // open up dropdowns
    await configPanel.page
      .getByRole('button', { name: 'Max Temperature (Reactor 1)' })
      .click();
    await configPanel.page.getByRole('button', { name: 'Label' }).click();

    // uncheck default value
    await configPanel.page.getByText('Use default data stream name').click();
    await page.waitForTimeout(1000);

    // click and change input value
    await configPanel.labelInput.fill(NEW_PROPERTY_NAME);

    // check if widget is updated
    const widget =
      dashboardWithKPIWidget.gridArea.getByTestId('kpi-base-component');
    expect(await widget.textContent()).toContain(NEW_PROPERTY_NAME);
  });
});
