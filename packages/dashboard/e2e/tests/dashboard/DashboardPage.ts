import { type Browser, type Locator, type Page } from '@playwright/test';
import { TEST_PAGE } from '../constants';

const DEFAULT_WIDGET_POS_X = 600;
const DEFAULT_WIDGET_POS_Y = 300;

export class DashboardPage {
  readonly page: Page;
  readonly browser: Browser;
  public readonly widgetPalette: Locator;
  public readonly lineChartWidgetButton: Locator;
  public readonly textWidgetButton: Locator;
  public readonly kpiWidgetButton: Locator;
  public readonly tableWidgetButton: Locator;
  public readonly gaugeWidgetButton: Locator;
  public readonly gridArea: Locator;
  public readonly confirmModalDeleteButton: Locator;
  public readonly contextMenuDeleteButton: Locator;

  constructor({ page, browser }: { page: Page; browser: Browser }) {
    this.page = page;
    this.browser = browser;
    this.widgetPalette = page.getByRole('list', { name: 'widget panel' });
    this.lineChartWidgetButton = page.getByRole('button', {
      name: 'add Line widget',
    });
    this.textWidgetButton = page.getByRole('button', {
      name: 'add Text widget',
    });
    this.kpiWidgetButton = page.getByRole('button', {
      name: 'add KPI widget',
    });
    this.tableWidgetButton = page.getByRole('button', {
      name: 'add Table widget',
    });
    this.gaugeWidgetButton = page.getByRole('button', {
      name: 'add Gauge widget',
    });
    this.gridArea = page.locator('#container');
    this.gridArea = page.locator('#container');
    this.confirmModalDeleteButton = this.page.getByRole('button', {
      name: 'Delete',
      exact: true,
    });
    this.contextMenuDeleteButton = this.gridArea.getByText('Delete');
  }

  public async goto() {
    await this.page.goto(TEST_PAGE);
  }

  public async makeViewportToAbsolute() {
    await this.page.getByLabel('Move backward').click();
  }

  private getCurrentWidgetButton(widgetType: string) {
    switch (widgetType) {
      case 'line':
        return this.lineChartWidgetButton;
      case 'text':
        return this.textWidgetButton;
      case 'kpi':
        return this.kpiWidgetButton;
      case 'table':
        return this.tableWidgetButton;
      case 'gauge':
        return this.gaugeWidgetButton;
      default:
        throw new Error('Widget type is not defined in dashboardPage test');
    }
  }

  public async addAWidgetByType(widgetType: string) {
    const currentWidgetButton = this.getCurrentWidgetButton(widgetType);
    await currentWidgetButton.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(DEFAULT_WIDGET_POS_X, DEFAULT_WIDGET_POS_Y, {
      steps: 10,
    });
    await this.page.mouse.up();
  }

  public async getDeleteButtonOfModal() {
    return this.page.getByRole('button', { name: 'Delete' });
  }
}
