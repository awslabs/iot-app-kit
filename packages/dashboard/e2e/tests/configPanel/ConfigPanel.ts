import { type Locator, type Page } from '@playwright/test';
const Y_LABEL_PLACEHOLDER_TEXT = 'Input Y-axis label';
const CHECKBOX_LOCATOR = 'input[type=checkbox]';
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
  readonly maxValueCheckbox: Locator;
  readonly minValueCheckbox: Locator;
  readonly showHideUnit: Locator;
  readonly showHideName: Locator;
  readonly showHideTimestamp: Locator;
  readonly showHideAggregationResolution: Locator;
  readonly propertiesTab: Locator;
  readonly labelInput: Locator;

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
    this.showYAxisToggle = this.container.locator(CHECKBOX_LOCATOR).first();
    this.showLegendToggle = this.container
      .locator(CHECKBOX_LOCATOR)
      .locator('nth=1');
    this.decimalPlaceInput = this.container
      .getByTestId('decimal-places')
      .locator('input');
    this.maxValueCheckbox = this.container
      .getByTestId('Maximum Value')
      .locator(CHECKBOX_LOCATOR);
    this.minValueCheckbox = this.container
      .getByTestId('Minimum Value')
      .locator(CHECKBOX_LOCATOR);
    this.showHideUnit = this.container
      .getByTestId('show-hide-unit')
      .locator(CHECKBOX_LOCATOR);
    this.showHideName = this.container
      .getByTestId('show-hide-name')
      .locator(CHECKBOX_LOCATOR);
    this.showHideTimestamp = this.container
      .getByTestId('show-hide-timestamp')
      .locator(CHECKBOX_LOCATOR);
    this.showHideAggregationResolution = this.container
      .getByTestId('show-hide-aggregation-resolution')
      .locator(CHECKBOX_LOCATOR);
    this.propertiesTab = this.container.getByTestId('properties');
    this.labelInput = this.container
      .getByTestId('label-input')
      .locator('input');
  }
}
