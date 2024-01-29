import { Locator, Page } from '@playwright/test';
import { RESOURCE_EXPLORER_FRAME } from '../constants';

export class ResourceExplorer {
  protected readonly page: Page;
  protected readonly reContainer: Locator;
  readonly reHeaderContainer: Locator;
  readonly collapsedLeftPanelIcon: Locator;
  readonly collapseLeftIcon: Locator;
  constructor({ page }: { page: Page }) {
    this.page = page;
    this.reContainer = page.locator(RESOURCE_EXPLORER_FRAME);
    this.reHeaderContainer = page.locator(
      '.collapsible-panel-header-container'
    );
    this.collapsedLeftPanelIcon = this.page.getByTestId(
      'collapsed-left-panel-icon'
    );
    this.collapseLeftIcon = this.reContainer.getByLabel('Collapse panel left');
  }

  public async addModeledProperties(properties: [string]) {
    const asset = this.reContainer.getByText('Africa site');
    await asset.click();
    const assetList = this.reContainer.getByText('Production Line 1', {
      exact: true,
    });
    await assetList.click();
    const selectAsset = this.reContainer.getByTitle('Select asset Reactor 1', {
      exact: true,
    });
    await selectAsset.click();

    // add all the properties
    for (let i = 0; i < properties.length; i++) {
      const propertyRow = this.reContainer.getByLabel(
        `Select modeled data stream ${properties[i]}`
      );
      await propertyRow.click();
    }
    // click add
    await this.reContainer
      .getByRole('button', { name: 'Add', exact: true })
      .click();
    // add some delay for the property to populate on the screen
    await this.page.waitForTimeout(3000);
  }
}
