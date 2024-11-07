import { type Page } from '@playwright/test';
import { TOOLBAR_FRAME } from '../constants';

export const toolbarUtil = (page: Page) => {
  const frame = page.locator(TOOLBAR_FRAME);

  return {
    saveDashboard: async () => {
      frame.getByText('Save').click();
    },
  };
};
