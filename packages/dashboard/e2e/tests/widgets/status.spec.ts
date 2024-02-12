// adding property
// disable if property already added
// disable if mulitiple properties selected
// changing sig digits
// thresholds
// color!

import { expect, test } from '../test';
import { getDecimalPlaces } from '../utils/getDecimalPlaces';

test.describe('Test Status Widget', () => {
  test('Status widget can be added to the dashboard', async ({
    dashboardWithStatusWidget,
  }) => {
    const widgetEmptyState = dashboardWithStatusWidget.gridArea.locator(
      '.status-widget-empty-state'
    );
    await expect(widgetEmptyState).toBeVisible();
  });

  test('Can add property to Status widget', async ({
    dashboardWithStatusWidget,
    resourceExplorer,
  }) => {
    await resourceExplorer.addModeledProperties(['Max Temperature']);
    const widget =
      dashboardWithStatusWidget.gridArea.getByTestId('status-widget');
    expect(await widget.textContent()).toContain('Max Temperature');
  });

  test('Cannot add more than 1 property to Status widget', async ({
    dashboardWithStatusWidget,
    resourceExplorer,
  }) => {
    //add property
    await resourceExplorer.addModeledProperties(['Max Temperature']);
    dashboardWithStatusWidget.gridArea.getByTestId('status-widget');
    //select 2 more properties
    await resourceExplorer.selectProperties(['Min Temperature', 'Temperature']);

    //check that add button is disabled
    const addButton = await resourceExplorer.getAddButton();
    await expect(addButton).toBeDisabled();
  });

  test('Cannot multiselect add property to Status widget', async ({
    dashboardWithStatusWidget,
    resourceExplorer,
  }) => {
    //select 3 properties
    await resourceExplorer.selectProperties([
      'Max Temperature',
      'Min Temperature',
      'Temperature',
    ]);
    dashboardWithStatusWidget.gridArea.locator('.status-widget-empty-state');

    //check that add button is disabled
    const addButton = await resourceExplorer.getAddButton();
    await expect(addButton).toBeDisabled();
  });

  test('Status Widget supports significant digits', async ({
    resourceExplorer,
    dashboardWithStatusWidget,
    configPanel,
  }) => {
    // add property
    await resourceExplorer.addModeledProperties(['Max Temperature']);

    //verify that initial value is not rounded
    const widgetValue = await dashboardWithStatusWidget.gridArea
      .getByTestId('status-value')
      .textContent();
    console.log(widgetValue);
    expect(getDecimalPlaces(widgetValue)).toBe(3);

    //change sig digits to 1
    await configPanel.collapsedButton.click();
    await configPanel.decimalPlaceInput.fill('1');

    //confirm that value has one decimal place
    const updatedWidgetValue = await dashboardWithStatusWidget.gridArea
      .getByTestId('status-value')
      .textContent();
    expect(getDecimalPlaces(updatedWidgetValue)).toBe(1);
  });

  test('Status Widget supports thresholds', async ({
    page,
    resourceExplorer,
    dashboardWithStatusWidget,
    configPanel,
  }) => {
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

    const widget =
      dashboardWithStatusWidget.gridArea.getByTestId('status-widget');

    await expect(widget).toHaveCSS('background-color', 'rgb(246, 56, 4)');
  });
});
