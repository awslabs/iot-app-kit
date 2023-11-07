import { test, expect } from '@playwright/test';

const TEST_PAGE = '/?path=/story/developer-scene-composer--local-scene';

test('dashboard', async ({ page }) => {
  const scenePage = await page.goto(TEST_PAGE);

  await expect(scenePage).toBeTruthy()
});
