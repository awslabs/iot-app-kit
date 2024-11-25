import { type Page, expect } from '@playwright/test';
import {
  RESOURCE_EXPLORER_FRAME,
  MODELED_TAB,
  UNMODELED_TAB,
  ASSET_MODEL_TAB,
} from '../constants';

const tabMap = {
  modeled: MODELED_TAB,
  unmodeled: UNMODELED_TAB,
  assetModel: ASSET_MODEL_TAB,
};
type Tabs = keyof typeof tabMap;

export const resourceExplorerUtil = (page: Page) => {
  const frame = page.locator(RESOURCE_EXPLORER_FRAME);

  /**
   * general RE specific actions
   */
  const generalActions = {
    /**
     * click the add button
     * will add the asset model configuration to the selection.
     *
     * @returns void
     */
    addToWidget: async () => {
      await frame.getByRole('button', { name: 'Add', exact: true }).click();
    },
  };

  /**
   * asset model tab specific actions
   */
  const assetModelActions = {
    /**
     * select an asset model from the dropdown
     *
     * @returns void
     */
    selectAssetModel: async (label: string) => {
      await frame.getByLabel('Asset model', { exact: true }).click();
      const searchBox = await frame.getByPlaceholder('Filter asset models');
      await searchBox.click();
      await searchBox.fill(label);
      await frame.getByText(label, { exact: true }).click();
    },
    /**
     * select a default asset from the dropdown
     *
     * @returns void
     */
    selectAsset: async (label: string) => {
      await frame.getByLabel('Default asset').click();
      await frame.getByText(label).click();
    },
    /**
     * save the asset model / asset selection
     *
     * @returns void
     */
    saveAssetModel: async () => {
      await frame.getByText('Set asset model').click();
    },
    /**
     * finds an asset property
     *
     * @returns Locator
     *
     */
    findProperty: (label: string) => {
      return frame.getByLabel(`Select modeled data stream ${label}`);
    },
    /**
     * select an asset model property from the table
     *
     * @returns void
     */
    selectProperty: async (label: string) => {
      await frame.getByLabel(`Select modeled data stream ${label}`).click();
    },

    findDisabledProperty: (label: string) => {
      return frame.getByLabel(
        `${label} data not supported for the selected widget`
      );
    },
  };

  /**
   * modeled tab specific actions
   */
  const modeledActions = {
    /**
     * finds an asset
     *
     * @returns Locator
     *
     */
    findAsset: (label: string) => {
      return frame.getByLabel(`Select asset ${label}`);
    },

    /**
     * select asset from table
     *
     * @returns void
     */
    selectAsset: (label: string) => {
      return frame.getByLabel(`Select asset ${label}`).click();
    },

    /**
     * finds an asset property
     *
     * @returns Locator
     *
     */
    findProperty: (label: string) => {
      return frame.getByLabel(`Select modeled data stream ${label}`);
    },
    /**
     * select asset property from table
     *
     * @returns void
     */
    selectProperty: async (label: string) => {
      await frame.getByLabel(`Select modeled data stream ${label}`).click();
    },
    /**
     * select a disabled asset property from table
     *
     * @returns void
     */
    findDisabledProperty: (label: string) => {
      return frame.getByLabel(
        `${label} data not supported for the selected widget`
      );
    },
  };

  return {
    /**
     * click the resource explorer icon to toggle it open
     *
     * @returns void
     */
    open: async () => {
      await expect(page.getByText('Resource explorer')).toBeVisible();
    },
    /**
     * click a tab on the resource explorer
     *
     * @returns void
     */
    tabTo: async (tab: Tabs) => {
      await frame.locator(tabMap[tab]).click();
    },
    generalActions,
    assetModelActions,
    modeledActions,
  };
};
