import { test } from '../test';
import { expect } from '@playwright/test';

test.describe('Property Panel Tests', () => {
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
    const propPanelTable = propPanel.locator(
      'div[class="properties-table-parent-container"]'
    );
    await expect(propPanelTable).toBeVisible();
  });

  test('test if the property panel opens when a widget is selected', async ({
    dashboardWithPropertyPanel,
  }) => {
    await dashboardWithPropertyPanel.addAWidgetByType('line');

    const propPanelTable = dashboardWithPropertyPanel.page.locator(
      'div[class="properties-table-parent-container"]'
    );
    const text = propPanelTable.getByText(
      'No data streams added to the widget'
    );
    await expect(text).toBeVisible();
  });

  test('test if the property panel stays open when a widget is deselected', async ({
    dashboardWithPropertyPanel,
    page,
  }) => {
    await dashboardWithPropertyPanel.addAWidgetByType('line');
    const boundingBox = await dashboardWithPropertyPanel.gridArea.boundingBox();

    await page.mouse.dblclick(boundingBox.x + 10, boundingBox.y + 10);

    const propPanelTable = dashboardWithPropertyPanel.page.locator(
      'div[class="properties-table-parent-container"]'
    );
    const text = propPanelTable.getByText('Please select a widget above');
    await expect(text).toBeVisible();
  });

  test('the resource explorer can be opened from property panel', async ({
    dashboardWithPropertyPanel,
    page,
  }) => {
    await dashboardWithPropertyPanel.addAWidgetByType('line');

    const propPanelTable = dashboardWithPropertyPanel.page.locator(
      'div[class="properties-table-parent-container"]'
    );
    await propPanelTable
      .getByText('+ Add data streams', { exact: true })
      .click();

    const REModal = page.getByText('Resource Explorer');
    await expect(REModal).toBeVisible();
  });

  // skipping until the follow-up CR , which will have the useWidgetData hook
  test.skip('Added properties are visible on the table', async ({
    dashboardWithPropertyPanel,
    page,
  }) => {
    await dashboardWithPropertyPanel.addAWidgetByType('line');

    const propPanelTable = dashboardWithPropertyPanel.page.locator(
      'div[class="properties-table-parent-container"]'
    );
    await propPanelTable
      .getByText('+ Add data streams', { exact: true })
      .click();

    const REModal = page.locator('div[class="property-panel-re-container"]');

    const asset = REModal.getByText('Africa site');
    await asset.click();
    const assetList = REModal.getByText('Production Line 1', {
      exact: true,
    });
    await assetList.click();
    const selectAsset = REModal.getByTitle('Select asset Reactor 1', {
      exact: true,
    });
    await selectAsset.click();

    const properties = ['Max Temperature', 'Min Temperature'];
    // add all the properties
    for (let i = 0; i < properties.length; i++) {
      const propertyRow = REModal.getByLabel(
        `Select modeled data stream ${properties[i]}`
      );
      await propertyRow.click();
    }
    // click add
    await REModal.getByRole('button', { name: 'Add', exact: true }).click();

    const boundingBox = await dashboardWithPropertyPanel.gridArea.boundingBox();

    await page.mouse.click(boundingBox.x + 10, boundingBox.y + 10);
    await page.waitForTimeout(1000);
    const text = await propPanelTable.textContent();
    expect(text).toContain('Max Temperature');
    expect(text).toContain('Min Temperature');
  });
});
