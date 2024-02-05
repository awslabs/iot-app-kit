import { Locator, Page } from '@playwright/test';
const Y_LABEL_PLACEHOLDER_TEXT = 'Input Y-axis label';
export class ConfigPanel {
  readonly page: Page;
  readonly container: Locator;
  readonly collapsedButton: Locator;
  readonly titleContainer: Locator;
  readonly YMinInput: Locator;
  readonly YMaxInput: Locator;
  readonly yAxisLabelInput: Locator;
  readonly showYAxisToggle: Locator;
  readonly showLegendToggle: Locator;
  readonly decimalPlaceInput: Locator;

  constructor({ page }: { page: Page }) {
    this.page = page;
    this.container = this.page.locator('.collapsible-panel-right');
    this.collapsedButton = this.page.getByTestId('collapsed-right-panel-icon');
    this.titleContainer = this.container.getByPlaceholder('Input Title');
    this.YMinInput = this.container.getByPlaceholder('Auto').first();
    this.YMaxInput = this.container.getByPlaceholder('Auto').locator('nth=1');
    this.yAxisLabelInput = this.container.getByPlaceholder(
      Y_LABEL_PLACEHOLDER_TEXT
    );
    this.showYAxisToggle = this.container
      .locator('input[type=checkbox]')
      .first();
    this.showLegendToggle = this.container
      .locator('input[type=checkbox]')
      .locator('nth=1');
    this.decimalPlaceInput = this.container
      .getByTestId('decimal-place-config')
      .locator('input');
  }
}
