import { expect, test } from '../test';
import { getDecimalPlaces } from '../utils/getDecimalPlaces';

// TODO: once MSW supports unit on Table add tests to ensure unit is correct

test.describe('Test Table Widget', () => {
  test('Table widget can be added to the dashboard', async ({
    dashboardWithTableWidget,
  }) => {
    const widgetEmptyState = dashboardWithTableWidget.gridArea.getByTestId(
      'table-widget-component'
    );
    await expect(widgetEmptyState).toBeVisible();
  });

  test('Can add property to Table widget', async ({
    dashboardWithTableWidget,
    resourceExplorer,
  }) => {
    await resourceExplorer.addModeledProperties(['Max Temperature']);
    const widget = dashboardWithTableWidget.gridArea.getByTestId(
      'table-widget-component'
    );
    expect(await widget.textContent()).toContain('Max Temperature');
  });

  test('Can multiselect add property to Table widget', async ({
    dashboardWithTableWidget,
    resourceExplorer,
  }) => {
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
    resourceExplorer,
    dashboardWithTableWidget,
    configPanel,
  }) => {
    // add property
    await resourceExplorer.addModeledProperties(['Max Temperature']);

    //verify that initial value is not rounded
    const widgetValue = await dashboardWithTableWidget.gridArea
      .getByTestId('table-value')
      .textContent();

    expect(getDecimalPlaces(widgetValue)).toBe(3);

    //change sig digits to 1
    await configPanel.collapsedButton.click();
    await configPanel.decimalPlaceInput.fill('1');

    //confirm that value has one decimal place
    const updatedWidgetValue = await dashboardWithTableWidget.gridArea
      .getByTestId('table-value')
      .textContent();

    expect(getDecimalPlaces(updatedWidgetValue)).toBe(1);
  });

  test('Table Widget supports thresholds', async ({
    page,
    resourceExplorer,
    dashboardWithTableWidget,
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

    const widget = dashboardWithTableWidget.gridArea.getByTestId('table-value');

    await expect(widget).toHaveCSS('color', 'rgb(246, 56, 4)');
  });
});
