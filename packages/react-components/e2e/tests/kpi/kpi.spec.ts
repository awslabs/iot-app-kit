import { test, expect } from '@playwright/test';

const TEST_PAGE = '/?path=/story/widgets-kpi-kpi-base--main';
const TEST_IFRAME = '#storybook-preview-iframe';

test('kpi', async ({ page }) => {
  await page.goto(TEST_PAGE);
  await page.evaluate(() => document.fonts.ready);
  const frame = page.frameLocator(TEST_IFRAME); // Need to go into frame otherwise the `locator` won't locate the selection.
  const KPIComponent = frame.getByTestId('kpi-base-component');
  const KPIError = frame.getByTestId('kpi-error-component');

  // KPI will always show value
  await expect(KPIComponent).toContainText('100');

  // unit will display
  const unit = 'mph';
  await page.goto(`${TEST_PAGE}&args=unit:${unit}`);
  await expect(KPIComponent).toContainText(unit);

  // name will display
  const name = 'windmill-name';
  await page.goto(`${TEST_PAGE}&args=name:${name}`);
  await expect(KPIComponent).toContainText(name);

  // displays as loading
  await page.goto(`${TEST_PAGE}&args=isLoading:true`);
  await expect(KPIComponent).toContainText('-');

  // error will display
  const errorMsg = 'my-custom-error-msg';
  await page.goto(`${TEST_PAGE}&args=error:${errorMsg}`);
  await expect(KPIError).toContainText(errorMsg);

  // displays empty state
  await page.goto(`${TEST_PAGE}&args=propertyPoint:!null`);
  await expect(KPIComponent).toContainText('-');
});
