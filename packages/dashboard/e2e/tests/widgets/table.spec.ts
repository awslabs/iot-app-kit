import { test, expect } from '@playwright/test';
import { NEW_PROPERTY_NAME } from '../constants';
import { getDecimalPlaces } from '../utils/getDecimalPlaces';
import { createNewDashboardWithWidget } from '../createDashboardWidget';
import { ResourceExplorer } from '../resourceExplorer/ResourceExplorer';
import { ConfigPanel } from '../configPanel/ConfigPanel';

// TODO: once MSW supports unit on Table add tests to ensure unit is correct

test.describe('Test Table Widget', () => {
  test('Table widget can be added to the dashboard', async ({
    page,
    browser,
  }) => {
    const dashboardWithTableWidget = await createNewDashboardWithWidget(
      'table',
      page,
      browser
    );
    const widgetEmptyState = dashboardWithTableWidget.gridArea.getByTestId(
      'table-widget-component'
    );
    await expect(widgetEmptyState).toBeVisible();
  });

  test('Can add property to Table widget', async ({ page, browser }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithTableWidget = await createNewDashboardWithWidget(
      'table',
      page,
      browser
    );
    await resourceExplorer.addModeledProperties(['Max Temperature']);
    const widget = dashboardWithTableWidget.gridArea.getByTestId(
      'table-widget-component'
    );
    expect(await widget.textContent()).toContain('Max Temperature');
  });

  test('Can multiselect add property to Table widget', async ({
    page,
    browser,
  }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithTableWidget = await createNewDashboardWithWidget(
      'table',
      page,
      browser
    );
    //select 3 properties
    await resourceExplorer.addModeledProperties([
      'Max Temperature',
      'Min Temperature',
      'Temperature',
    ]);
    const widgetText = await dashboardWithTableWidget.gridArea
      .getByTestId('table-widget-component')
      .textContent();
    expect(widgetText).toContain('Max Temperature');
    expect(widgetText).toContain('Min Temperature');
    expect(widgetText).toContain('Temperature');
  });

  test('Table Widget supports significant digits', async ({
    page,
    browser,
  }) => {
    const configPanel = new ConfigPanel({ page });
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithTableWidget = await createNewDashboardWithWidget(
      'table',
      page,
      browser
    );
    // add property
    await resourceExplorer.addModeledProperties(['Max Temperature']);

    //verify that initial value is not rounded
    const widgetValue = await dashboardWithTableWidget.gridArea
      .getByTestId('table-value')
      .textContent();

    // because of rounding, sometimes 0 gets cut off
    // hence we want to check a range of [sig digits - 1, sig digits]
    expect(getDecimalPlaces(widgetValue)).toBeGreaterThanOrEqual(2);
    expect(getDecimalPlaces(widgetValue)).toBeLessThanOrEqual(4);

    //change sig digits to 1
    await configPanel.collapsedButton.click();
    await configPanel.decimalPlaceInput.fill('1');

    //confirm that value has one decimal place
    const updatedWidgetValue = await dashboardWithTableWidget.gridArea
      .getByTestId('table-value')
      .textContent();

    // because of rounding, sometimes 0 gets cut off
    // hence we want to check a range of [sig digits - 1, sig digits]
    expect(getDecimalPlaces(updatedWidgetValue)).toBeGreaterThanOrEqual(0);
    expect(getDecimalPlaces(updatedWidgetValue)).toBeLessThanOrEqual(1);
  });

  test('Table Widget supports thresholds', async ({ page, browser }) => {
    const configPanel = new ConfigPanel({ page });
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithTableWidget = await createNewDashboardWithWidget(
      'table',
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

    const widget = dashboardWithTableWidget.gridArea.getByTestId('table-value');

    await expect(widget).toHaveCSS('color', 'rgb(246, 56, 4)');
  });

  test('Table widget can change label', async ({ page, browser }) => {
    const configPanel = new ConfigPanel({ page });
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithTableWidget = await createNewDashboardWithWidget(
      'table',
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
    await configPanel.page.getByText('Use default datastream name').click();
    await page.waitForTimeout(1000);

    // click and change input value
    await configPanel.labelInput.fill(NEW_PROPERTY_NAME);

    // check if widget is updated
    const widgetText = await dashboardWithTableWidget.gridArea
      .getByTestId('table-widget-component')
      .textContent();
    expect(widgetText).toContain(NEW_PROPERTY_NAME);
  });
});
