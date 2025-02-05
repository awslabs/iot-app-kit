import { expect, test } from '@playwright/test';

test('dashboard package smoke test', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByText('Browse assets and add asset properties to the line widget.')
  ).toBeVisible();
});
