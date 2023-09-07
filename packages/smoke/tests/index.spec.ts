import { test, expect } from '@playwright/test';

import { TestSelector } from '../stories/utils/testSelector';

const getTestPage = (storyId: 'dashboard' | 'react-components') =>
  `http://localhost:6006/iframe.html?id=${storyId}--smoke-test&viewMode=story`;

const TEST_IFRAME = '#root';

test('dashboard', async ({ page }) => {
  await page.goto(getTestPage('dashboard'));
  const frame = page.locator(TEST_IFRAME);

  await expect(frame.locator(TestSelector)).toBeVisible();
});

test('react-components', async ({ page }) => {
  await page.goto(getTestPage('react-components'));
  const frame = page.locator(TEST_IFRAME);

  await expect(frame.locator(TestSelector)).toBeVisible();
});
