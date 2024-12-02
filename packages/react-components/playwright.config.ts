import { defineConfig, devices } from '@playwright/test';

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60_000;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 100 * SECOND_IN_MS,
    toMatchSnapshot: { maxDiffPixels: 200, maxDiffPixelRatio: 0.05 },
    toHaveScreenshot: { maxDiffPixels: 200, maxDiffPixelRatio: 0.05 },
  },
  timeout: 100 * SECOND_IN_MS,
  globalTimeout: 5 * MINUTE_IN_MS,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { host: '0.0.0.0' }],
  ] /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */,
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    baseURL: 'http://localhost:6007/',
    storageState: {
      cookies: [],
      origins: [
        {
          origin: 'localhost',
          localStorage: [
            { name: 'USE_SVG_FOR_ECHARTS_PLAYWRIGHT_TEST_ONLY', value: 'true' },
          ],
        },
      ],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    reuseExistingServer: !process.env.CI,
    url: 'http://localhost:6007',
    timeout: 5 * MINUTE_IN_MS,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
