import { Locator, Page } from '@playwright/test';
import { RESOURCE_EXPLORER_FRAME } from '../constants';

export class ResourceExplorer {
  protected readonly page: Page;
  protected readonly resourceExplorerContainer: Locator;
  readonly resourceExplorerHeaderContainer: Locator;
  readonly collapsedLeftPanelIcon: Locator;
  readonly collapseLeftIcon: Locator;
  constructor({ page }: { page: Page }) {
    this.page = page;
    this.resourceExplorerContainer = page.locator(RESOURCE_EXPLORER_FRAME);
    this.resourceExplorerHeaderContainer = page.locator(
      '.collapsible-panel-header-container'
    );
    this.collapsedLeftPanelIcon = this.page.getByTestId(
      'collapsed-left-panel-icon'
    );
    this.collapseLeftIcon = this.resourceExplorerContainer.getByLabel(
      'Collapse panel left'
    );
  }

  public async getAddButton() {
    return await this.resourceExplorerContainer.getByRole('button', {
      name: 'Add',
      exact: true,
    });
  }

  public async selectProperties(properties: string[]) {
    const asset = this.resourceExplorerContainer.getByText('Africa site');
    await asset.click();
    const assetList = this.resourceExplorerContainer.getByText(
      'Production Line 1',
      {
        exact: true,
      }
    );
    await assetList.click();
    const selectAsset = this.resourceExplorerContainer.getByTitle(
      'Select asset Reactor 1',
      {
        exact: true,
      }
    );
    await selectAsset.click();

    // add all the properties
    for (let i = 0; i < properties.length; i++) {
      const propertyRow = this.resourceExplorerContainer.getByLabel(
        `Select modeled data stream ${properties[i]}`
      );
      await propertyRow.click();
    }
  }

  public async addModeledProperties(properties: string[]) {
    await this.selectProperties(properties);
    // click add
    await this.resourceExplorerContainer
      .getByRole('button', { name: 'Add', exact: true })
      .click();
    // add some delay for the property to populate on the screen
    await this.page.waitForTimeout(3000);
  }
}
