import { expect } from '@playwright/test';

import { test } from '../fixtures';

test.skip('Dashboard Canvas', () => {
  test('should render the webgl context canvas in the appropriate position', async ({
    singleWidgetCustomDataSourceDashboardPage: { page },
  }) => {
    expect(await page.screenshot()).toMatchSnapshot();
  });
});
