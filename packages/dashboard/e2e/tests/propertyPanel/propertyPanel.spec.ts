import { test } from '../test';
import { expect } from '@playwright/test';

test.describe('Property Panel Tests', () => {
  test.skip();
  test('test if the property panel is visible in the new layout', async ({
    dashboardWithPropertyPanel,
  }) => {
    const propPanel = dashboardWithPropertyPanel.page.locator(
      'div[class="property-panel-container"]'
    );
    await expect(propPanel).toBeVisible();
  });

  test('test if the property panel opens on clicking the header', async ({
    dashboardWithPropertyPanel,
  }) => {
    const propPanel = dashboardWithPropertyPanel.page.locator(
      'div[class="property-panel-container"]'
    );
    await propPanel.click();
    const boundingBox = await propPanel.boundingBox();
    expect(boundingBox.height > 62).toBeTruthy();
  });

  test('test if the property panel opens when a widget is selected', async ({
    dashboardWithPropertyPanel,
  }) => {
    await dashboardWithPropertyPanel.addAWidgetByType('line');
    const propPanel = dashboardWithPropertyPanel.page.locator(
      'div[class="property-panel-container"]'
    );
    const boundingBox = await propPanel.boundingBox();
    expect(boundingBox.height > 62).toBeTruthy();
  });

  test('test if the property panel stays open when a widget is deselected', async ({
    dashboardWithPropertyPanel,
    page,
  }) => {
    await dashboardWithPropertyPanel.addAWidgetByType('line');
    const boundingBox = await dashboardWithPropertyPanel.gridArea.boundingBox();
    await page.mouse.dblclick(boundingBox.x + 10, boundingBox.y + 10);
    const propPanel = dashboardWithPropertyPanel.page.locator(
      'div[class="property-panel-container"]'
    );
    const propPanelBoundingBox = await propPanel.boundingBox();
    expect(propPanelBoundingBox.height > 62).toBeTruthy();
  });

  test('test if the property panel resizes ', async ({
    dashboardWithPropertyPanel,
    page,
  }) => {
    const propPanel = dashboardWithPropertyPanel.page.locator(
      'div[class="property-panel-container"]'
    );
    await propPanel.click();
    const handle = propPanel.locator(
      'span[class="react-resizable-handle react-resizable-handle-n"]'
    );
    await expect(handle).toBeVisible();
    const propPanelBeforeMoveBoundingBox = await propPanel.boundingBox();
    const handleBoundingBox = await handle.boundingBox();
    await handle.hover();
    await page.mouse.down();
    await page.mouse.move(handleBoundingBox.x, handleBoundingBox.y - 100);
    await page.mouse.up();

    expect(
      (await propPanel.boundingBox()).height >
        propPanelBeforeMoveBoundingBox.height
    ).toBeTruthy();
  });
});
