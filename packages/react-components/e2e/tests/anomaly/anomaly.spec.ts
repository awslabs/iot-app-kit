import { expect, test } from '@playwright/test';

const TEST_IFRAME = '#storybook-preview-iframe';
const TEST_PAGE_DEFAULT_SETTINGS =
  '/?path=/story/widgets-anomaly--default-settings-anomaly-chart';
const TEST_PAGE_HIDDEN_SECTIONS =
  '/?path=/story/widgets-anomaly--anomaly-chart-hidden-axis-and-timestamp';
const TEST_PAGE_ERROR_STATE =
  '/?path=/story/widgets-anomaly--anomaly-chart-error-state';

test.describe('test anomaly chart', () => {
  test('anomaly chart default settings', async ({ page }) => {
    await page.goto(TEST_PAGE_DEFAULT_SETTINGS);
    const frame = page.frameLocator(TEST_IFRAME);
    const AnomalyContainer = frame.getByTestId('anomaly-chart-container');
    const AnomalyChart = AnomalyContainer.getByTestId('anomaly-chart');

    // Anomaly chart should be visible
    await expect(AnomalyChart).toBeVisible();

    // screenshot comparison
    await expect(AnomalyChart).toHaveScreenshot('anomaly-chart.png');
  });

  test('anomaly chart everything hidden', async ({ page }) => {
    await page.goto(TEST_PAGE_HIDDEN_SECTIONS);
    const frame = page.frameLocator(TEST_IFRAME);
    const AnomalyContainer = frame.getByTestId('anomaly-chart-container');
    const AnomalyChart = AnomalyContainer.getByTestId('anomaly-chart');

    // Anomaly chart should be visible
    await expect(AnomalyChart).toBeVisible();

    // screenshot comparison
    await expect(AnomalyChart).toHaveScreenshot(
      'anomaly-chart-hidden-axis-timestamp.png'
    );
  });

  test('anomaly chart error state', async ({ page }) => {
    await page.goto(TEST_PAGE_ERROR_STATE);
    const frame = page.frameLocator(TEST_IFRAME);
    const AnomalyContainer = frame.getByTestId('anomaly-chart-container');

    // Anomaly chart should be visible
    await expect(AnomalyContainer).toBeVisible();

    // screenshot comparison
    await expect(AnomalyContainer).toHaveScreenshot('anomaly-chart-error.png');
  });
});
