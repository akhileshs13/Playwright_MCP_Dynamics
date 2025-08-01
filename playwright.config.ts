import type { PlaywrightTestConfig } from "@playwright/test";
import dotenv from 'dotenv';
import path from 'path';

// Default to .env if ENV_FILE is not provided, use env.test directory
const envFile = process.env.ENV_FILE || '.env'
dotenv.config({ path: path.resolve(__dirname, `env.test/${envFile}`) });

const config: PlaywrightTestConfig = {
  testDir: './',
  testMatch: ["**/*.spec.ts", "**/test*.ts"],
  testIgnore: ["**/setup/**", "**/MCP/**", "**/globals/**", "**/utils/**", "**/page-objects/**", "**/pages/**", "**/regressionFlow.spec.ts", "**/fixtures/**"],
  timeout: 600000,
  expect: {
    timeout: 10000,
  },
  use: {
    viewport: { width: 1280, height: 720 },
    headless: false,
    launchOptions: {
      slowMo: 100,
    },
    actionTimeout: 10000,  // 10 seconds timeout for actions like click, fill, etc.
    navigationTimeout: 15000, // navigation timeout
    screenshot: 'only-on-failure', // Take screenshot only on failure
    trace: 'retain-on-failure', // Retain trace files on failure
    baseURL: process.env.DYN365_ORGURL, // Base URL for the tests
    storageState: './storage-state/storageState.json', // Path to the root storage state file
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    video: 'retain-on-failure', // Retain video files on failure

  },
  outputDir: "artifacts",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 3 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['junit', { outputFile: process.env.JUNIT_REPORT_PATH || 'artifacts/test-results.xml' }],
    ['allure-playwright']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  globalSetup: require.resolve('./globals/global-setup'),

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    },
    // {
    //   name: 'edge',
    //   use: { browserName: 'chromium', channel: 'msedge' }
    // },
    // {
    //   name: 'webkit',
    //   use: { browserName: 'webkit' }
    // }
  ],
};

export default config;