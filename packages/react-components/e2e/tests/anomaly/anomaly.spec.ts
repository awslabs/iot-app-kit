import { test, expect } from '@playwright/test';

const TEST_IFRAME = '#storybook-preview-iframe';
const TEST_PAGE_DEFAULT_SETTINGS =
  '/?path=/story/widgets-anomaly--default-settings-anomaly-widget';
const TEST_PAGE_HIDDEN_SECTIONS =
  '/?path=/story/widgets-anomaly--anomaly-widget-hidden-axis-and-timestamp';
const TEST_PAGE_ERROR_STATE =
  '/?path=/story/widgets-anomaly--anomaly-widget-error-state';

test.describe('test anomaly widget', () => {
  test('anomaly widget default settings', async ({ page }) => {
    await page.goto(TEST_PAGE_DEFAULT_SETTINGS);
    const frame = page.frameLocator(TEST_IFRAME);
    const AnomalyContainer = frame.getByTestId('anomaly-widget-container');
    const AnomalyWidget = AnomalyContainer.getByTestId('anomaly-widget');

    // Anomaly widget should be visible
    await expect(AnomalyWidget).toBeVisible();

    // screenshot comparison
    await expect(AnomalyWidget).toHaveScreenshot('anomaly-widget.png');
  });

  test('anomaly widget everything hidden', async ({ page }) => {
    await page.goto(TEST_PAGE_HIDDEN_SECTIONS);
    const frame = page.frameLocator(TEST_IFRAME);
    const AnomalyContainer = frame.getByTestId('anomaly-widget-container');
    const AnomalyWidget = AnomalyContainer.getByTestId('anomaly-widget');

    // Anomaly widget should be visible
    await expect(AnomalyWidget).toBeVisible();

    // screenshot comparison
    await expect(AnomalyWidget).toHaveScreenshot(
      'anomaly-widget-hidden-axis-timestamp.png'
    );
  });

  test('anomaly widget error state', async ({ page }) => {
    await page.goto(TEST_PAGE_ERROR_STATE);
    const frame = page.frameLocator(TEST_IFRAME);
    const AnomalyContainer = frame.getByTestId('anomaly-widget-container');

    // Anomaly widget should be visible
    await expect(AnomalyContainer).toBeVisible();

    // screenshot comparison
    await expect(AnomalyContainer).toHaveScreenshot('anomaly-widget-error.png');
  });
});
