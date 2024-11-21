import { expect, test } from '@playwright/test';

const TEST_DATA_ID = 'gauge-base-component';
const TEST_PAGE = '/iframe.html?args=&id=widgets-gauge--default-gauge';
const TEST_PAGE_HIDDEN_SETTINGS =
  '/iframe.html?args=&id=widgets-gauge--hidden-settings-gauge';
const THRESHOLD_TEST_PAGE =
  '/iframe.html?args=&id=widgets-gauge--threshold-gauge';
const DELETABLE_THRESHOLD_TEST_PAGE =
  '/iframe.html?args=&id=widgets-gauge--deleteable-thresholds-gauge';

test('default guage', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const chart = page.getByTestId(TEST_DATA_ID);
  // screenshot comparison
  await expect(chart).toHaveScreenshot('gauge-default-settings.png');
});

test('hidden guage settings', async ({ page }) => {
  await page.goto(TEST_PAGE_HIDDEN_SETTINGS);
  const chart = page.getByTestId(TEST_DATA_ID);
  // screenshot comparison
  await expect(chart).toHaveScreenshot('gauge-hidden-settings.png');
});

test('guage with threshold', async ({ page }) => {
  await page.goto(THRESHOLD_TEST_PAGE);
  const chart = page.getByTestId(TEST_DATA_ID);
  // screenshot comparison
  await expect(chart).toHaveScreenshot('gauge-with-thresholds.png');
});

test('deleting a gauge threshold properly renders the widget', async ({
  page,
}) => {
  await page.goto(DELETABLE_THRESHOLD_TEST_PAGE);
  const chart = page.getByTestId(TEST_DATA_ID);
  // screenshot comparison
  await expect(chart).toHaveScreenshot(
    'gauge-with-thresholds-before-delete.png'
  );

  const deleteBtn = page.getByRole('button', {
    name: 'Remove thresholds',
    exact: true,
  });

  await deleteBtn.click();

  // screenshot comparison
  await expect(chart).toHaveScreenshot(
    'gauge-with-thresholds-after-delete.png'
  );
});
