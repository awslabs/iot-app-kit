import { expect, test } from '@playwright/test';

const TEST_PAGE =
  '/iframe.html?args=&id=widget-instance-assistant-chatbot--assistant-chatbot-default';
const TEST_PAGE_PROCESSING =
  '/iframe.html?args=&id=widget-instance-assistant-chatbot--assistant-processing-state';
const TEST_PAGE_ERROR =
  '/iframe.html?args=&id=widget-instance-assistant-chatbot--assistant-error-state';

test('chatbot', async ({ page }) => {
  await page.goto(TEST_PAGE);
  const ChatbotComponent = page.getByTestId('default-chatbot-story');

  // screenshot comparison with everything showing
  await expect(ChatbotComponent).toHaveScreenshot('chatbot-default.png');
});

test('chatbot processing state', async ({ page }) => {
  await page.goto(TEST_PAGE_PROCESSING);
  const ChatbotComponent = page.getByTestId('processing-chatbot-story');

  // screenshot comparison with everything hidden
  await expect(ChatbotComponent).toHaveScreenshot('chatbot-processing.png');
});

test('chatbot error state', async ({ page }) => {
  await page.goto(TEST_PAGE_ERROR);
  const ChatbotComponent = page.getByTestId('error-chatbot-story');

  // screenshot comparison
  await expect(ChatbotComponent).toHaveScreenshot('chatbot-error.png');
});
