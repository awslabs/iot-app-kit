import type { Browser, Page } from '@playwright/test';

export class SingleWidgetCustomDataSourceDashboardPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async create(browser: Browser) {
    const context = await browser.newContext();

    const page = await context.newPage();

    await page.goto('http://localhost:6006/iframe.html?id=e2edashboardtest--single-widget&viewMode=story');

    await page.waitForSelector('sc-webgl-base-chart .data-container', { state: 'visible' });

    return new SingleWidgetCustomDataSourceDashboardPage(page);
  }
}
