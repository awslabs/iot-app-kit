import { test, expect } from '@playwright/test';

const TEST_IFRAME = '#storybook-preview-iframe';
const TEST_PAGE = '/?path=/story/widgets-gauge-gauge-base--main';

test('guage', async ({ page }) => {
  await page.goto(TEST_PAGE);
  await page.evaluate(() => document.fonts.ready);
  const frame = page.frameLocator(TEST_IFRAME); // Need to go into frame otherwise the `locator` won't locate the selection.
  const GaugeComponent = frame.getByTestId('gauge-base-component');
  const GaugeError = frame.getByTestId('gauge-base-component-error');

  // Gauge component should be visible
  await expect(GaugeComponent).toBeVisible();

  // Gauge should displays 'Uncertain Quality' for 'UNCERTAIN' quality
  await page.goto(`${TEST_PAGE}&args=propertyPoint.quality:UNCERTAIN`);
  await expect(GaugeComponent).toContainText('Uncertain Quality');

  // Gauge should displays 'Bad Quality' for 'BAD' quality
  await page.goto(`${TEST_PAGE}&args=propertyPoint.quality:BAD`);
  await expect(GaugeComponent).toContainText('Bad Quality');

  // Gauge should display error text when error is provided
  const errorMsg = 'No Network';
  await page.goto(`${TEST_PAGE}&args=error:${errorMsg}`);
  await expect(GaugeError).toContainText(errorMsg);

  // Gauge default settings
  const gaugeValueElement = GaugeComponent.getByText('82');
  const gaugeUnitElement = GaugeComponent.getByText('%');
  const gaugeOutsideArcLabelelement = GaugeComponent.getByText('100');
  await page.goto(`${TEST_PAGE}`);
  await expect(GaugeComponent).not.toContainText('Windmill');
  await expect(GaugeComponent).toContainText('%');
  await expect(gaugeValueElement).toHaveCSS('font-size', '40px');
  await expect(gaugeUnitElement).toHaveCSS('font-size', '16px');
  await expect(gaugeOutsideArcLabelelement).toHaveCSS('font-size', '12px');
  await expect(GaugeComponent).toContainText('0');
  await expect(GaugeComponent).toContainText('100');

  // Gauge settings should display name when showName is true
  await page.goto(`${TEST_PAGE}&args=settings.showName:true`);
  await expect(GaugeComponent).toContainText('Windmill');

  // Gauge settings should not display unit when showUnit is false
  await page.goto(`${TEST_PAGE}&args=settings.showUnit:false`);
  await expect(GaugeComponent).not.toContainText('%');

  // Gauge settings should disaplay the font size of 50 for value text
  await page.goto(`${TEST_PAGE}&args=settings.fontSize:50`);
  await expect(gaugeValueElement).toHaveCSS('font-size', '50px');

  // Gauge settings should disaplay the unit size of 20 for unit text
  await page.goto(`${TEST_PAGE}&args=settings.unitFontSize:20`);
  await expect(gaugeUnitElement).toHaveCSS('font-size', '20px');

  // Gauge settings should disaplay the labelFontSize size of 16 for label text
  await page.goto(`${TEST_PAGE}&args=settings.labelFontSize:16`);
  await expect(gaugeOutsideArcLabelelement).toHaveCSS('font-size', '16px');

  // Gauge settings should change the yMin value to 15
  await page.goto(`${TEST_PAGE}&args=settings.yMin:15`);
  await expect(GaugeComponent).toContainText('15');

  // Gauge settings should change the yMax value to 200
  await page.goto(`${TEST_PAGE}&args=settings.yMax:200`);
  await expect(GaugeComponent).toContainText('200');
});
