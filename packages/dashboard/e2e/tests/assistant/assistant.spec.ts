import { expect, test } from '@playwright/test';

const TEST_PAGE = '/iframe.html?args=&id=dashboard-mocked-data--view-only';

test('dashboard has assistant enabled', async ({ page }) => {
  await page.goto(TEST_PAGE);

  await expect(
    page.getByTestId('assistant-menu-buttons-container')
  ).toBeVisible();
});

test('enable assistant mode and selects widgets', async ({ page }) => {
  await page.goto(TEST_PAGE);

  const assistantBtn = await page.getByRole('button', {
    name: /AI Assistant/i,
  });

  await assistantBtn.click();

  await page.getByRole('checkbox').nth(3).check();
  await page.getByRole('checkbox').nth(4).check();

  await expect(page.getByText('2/3 items selected')).toBeVisible();

  const summaryBtn = await page.getByRole('button', {
    name: /Generate summary/i,
  });

  expect(await summaryBtn.isDisabled()).toBeFalsy();
});

test('disable assistant buttons when selects more than 3 widgets', async ({
  page,
}) => {
  await page.goto(TEST_PAGE);

  const assistantBtn = await page.getByRole('button', {
    name: /AI Assistant/i,
  });

  await assistantBtn.click();

  await page.getByRole('checkbox').nth(1).check();
  await page.getByRole('checkbox').nth(2).check();
  await page.getByRole('checkbox').nth(3).check();
  await page.getByRole('checkbox').nth(4).check();

  await expect(page.getByText('4/3 items selected')).toBeVisible();

  const summaryBtn = await page.getByRole('button', {
    name: '4/3 items selected',
  });

  await summaryBtn.click();

  await expect(page.getByText('Property limit reached')).toBeVisible();
});

test('open assistant chatbot when generate summary is clicked', async ({
  page,
}) => {
  await page.goto(TEST_PAGE);

  const assistantBtn = await page.getByRole('button', {
    name: /AI Assistant/i,
  });

  await assistantBtn.click();

  await page.getByRole('checkbox').nth(3).check();

  await expect(page.getByText('1/3 items selected')).toBeVisible();

  const summaryBtn = await page.getByRole('button', {
    name: /Generate summary/i,
  });

  await summaryBtn.click();

  await expect(
    page.getByPlaceholder('Ask me anything about your IoT data')
  ).toBeVisible();
});

test('open and close chatbot', async ({ page }) => {
  await page.goto(TEST_PAGE);

  const chatbotOpenBtn = await page.getByTestId('collapsed-right-panel-icon');

  await chatbotOpenBtn.click();

  await expect(
    page.getByPlaceholder('Ask me anything about your IoT data')
  ).toBeVisible();

  const chatbotCloseBtn = await page.getByTestId(
    'assistant-chatbot-close-button'
  );

  await chatbotCloseBtn.click();
});
