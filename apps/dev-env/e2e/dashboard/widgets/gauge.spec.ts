import { test, expect } from '@playwright/test';
import { getDecimalPlaces } from '../utils/getDecimalPlaces';
import { createNewDashboardWithWidget } from '../createDashboardWidget';
import { ResourceExplorer } from '../resourceExplorer/ResourceExplorer';
import { ConfigPanel } from '../configPanel/ConfigPanel';

test.describe('validate gauge widget behavior', () => {
  test('gauge widget can be added to the dashboard', async ({
    page,
    browser,
  }) => {
    const dashboardWithGaugeWidget = await createNewDashboardWithWidget(
      'gauge',
      page,
      browser
    );
    const widgetEmptyState = dashboardWithGaugeWidget.gridArea.locator(
      '.gauge-widget-empty-state'
    );
    await expect(widgetEmptyState).toBeVisible();
  });

  test('gauge widget renders value when a property is added', async ({
    page,
    browser,
  }) => {
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithGaugeWidgetWithProperty =
      await createNewDashboardWithWidget(
        'gauge',
        page,
        browser,
        resourceExplorer
      );
    const widget = dashboardWithGaugeWidgetWithProperty.gridArea.locator(
      '[data-gesture=widget]'
    );

    const gaugeValue = widget
      .locator('g')
      .locator('text[fill="#7d2105"]')
      .first();
    await expect(gaugeValue).toBeVisible();
  });

  test('cannot add more than 1 property to gauge widget', async ({
    page,
    browser,
  }) => {
    // add property
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithGaugeWidget = await createNewDashboardWithWidget(
      'gauge',
      page,
      browser
    );
    await resourceExplorer.addModeledProperties(['Max Temperature']);
    dashboardWithGaugeWidget.gridArea.getByTestId('gauge-base-component');
    // select 2 more properties
    await resourceExplorer.selectProperties(['Min Temperature', 'Temperature']);

    // check that add button is disabled
    const addButton = await resourceExplorer.getAddButton();
    await expect(addButton).toBeDisabled();
  });

  test('update title reflects on the guage widget', async ({
    page,
    browser,
  }) => {
    const configPanel = new ConfigPanel({ page });
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithGaugeWidgetWithProperty =
      await createNewDashboardWithWidget(
        'gauge',
        page,
        browser,
        resourceExplorer
      );
    await configPanel.collapsedButton.click();
    expect(await configPanel.container.isVisible()).toBeTruthy();

    // update name and validate new title is on widget
    await configPanel.titleContainer.fill('New Gauge Widget');
    const widget = dashboardWithGaugeWidgetWithProperty.gridArea.locator(
      '[data-gesture=widget]'
    );
    expect(await widget.textContent()).toContain('New Gauge Widget');
  });

  test('deleting a property is reflected on the chart', async ({
    page,
    browser,
  }) => {
    const configPanel = new ConfigPanel({ page });
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithGaugeWidgetWithProperty =
      await createNewDashboardWithWidget(
        'gauge',
        page,
        browser,
        resourceExplorer
      );
    // Remove exising property and validate its not on the widget
    await configPanel.collapsedButton.click();
    await configPanel.container.getByText('Properties').click();
    await configPanel.container.getByLabel('delete property').first().click();

    const widget = dashboardWithGaugeWidgetWithProperty.gridArea.locator(
      '[data-gesture=widget]'
    );

    await page.waitForTimeout(1000);
    const gaugeText = await widget.textContent();
    expect(gaugeText).not.toContain('Max Temperature');
  });

  test('gauge widget supports significant digits', async ({
    page,
    browser,
  }) => {
    const configPanel = new ConfigPanel({ page });
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithGaugeWidgetWithProperty =
      await createNewDashboardWithWidget(
        'gauge',
        page,
        browser,
        resourceExplorer
      );
    const widget = dashboardWithGaugeWidgetWithProperty.gridArea.locator(
      '[data-gesture=widget]'
    );

    const gaugeText = await widget.textContent();
    const gaugeValue = gaugeText?.match('\\d+\\.*\\d*')?.at(0);
    expect(getDecimalPlaces(gaugeValue)).toBe(4);

    // change sig digits to 1 and validate rendered value is correct
    await configPanel.collapsedButton.click();
    await configPanel.decimalPlaceInput.fill('1');

    const updatedText = await widget.textContent();
    const updatedValue = updatedText?.match('\\d+\\.*\\d*')?.at(0);

    expect(getDecimalPlaces(updatedValue)).toBe(1);
  });

  test('renders a single threshold with correct color', async ({
    page,
    browser,
  }) => {
    const configPanel = new ConfigPanel({ page });
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithGaugeWidgetWithProperty =
      await createNewDashboardWithWidget(
        'gauge',
        page,
        browser,
        resourceExplorer
      );
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

    const widget = dashboardWithGaugeWidgetWithProperty.gridArea.locator(
      '[data-gesture=widget]'
    );
    const threshold = widget.locator('g').locator('path[fill="#f63804"]');
    await expect(threshold).toBeVisible();
  });

  test('renders multiple thresholds with correct colors', async ({
    page,
    browser,
  }) => {
    const configPanel = new ConfigPanel({ page });
    const resourceExplorer = new ResourceExplorer({ page });
    const dashboardWithGaugeWidgetWithProperty =
      await createNewDashboardWithWidget(
        'gauge',
        page,
        browser,
        resourceExplorer
      );
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

    // add a second threshold
    await configPanel.container
      .getByRole('button', {
        name: 'Add a threshold',
        exact: true,
      })
      .click();
    await page.waitForTimeout(1000);
    const thresholdDisplay2 = configPanel.container.locator(
      'div[class="threshold-display"]'
    );
    await thresholdDisplay2
      .locator('div[class="threshold-configuration"]')
      .locator('button')
      .first()
      .click();
    await page.keyboard.down('ArrowDown');
    await page.keyboard.down('Enter');

    await configPanel.container
      .getByPlaceholder('Threshold value')
      .nth(1)
      .fill('2');
    await thresholdDisplay2.getByLabel('color picker').nth(1).fill('#000000');

    const widget = dashboardWithGaugeWidgetWithProperty.gridArea.locator(
      '[data-gesture=widget]'
    );

    // validate both thresholds are on widget
    const firstThreshold = widget.locator('g').locator('path[fill="#f63804"]');
    await expect(firstThreshold).toBeVisible();

    const secondThreshold = widget.locator('g').locator('path[fill="#000000"]');
    await expect(secondThreshold).toBeVisible();
  });
});
