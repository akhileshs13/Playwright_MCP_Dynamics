import type { PlaywrightTestConfig } from "@playwright/test";
import dotenv from 'dotenv';
import path from 'path';

// Load MCP-specific environment
dotenv.config({ path: path.resolve(__dirname, 'MCP/.env-mcp') });

const config: PlaywrightTestConfig = {
  testDir: './MCP',
  testMatch: ["**/spec/*.spec.ts"], // Only match spec files by default
  testIgnore: ["**/pages/**", "**/storage-state/**", "**/setup/**"],
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
    actionTimeout: 10000,
    navigationTimeout: 15000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    baseURL: process.env.DY_URL,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },
  outputDir: "artifacts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 3 : 1,
  reporter: [
    ['junit', { outputFile: process.env.JUNIT_REPORT_PATH || 'artifacts/test-results.xml' }],
    ['allure-playwright']
  ],
  // No global setup for MCP tests

  projects: [
    // Setup project for authentication
    {
      name: 'setup',
      testMatch: '**/setup/*.setup.ts',
      use: {
        storageState: undefined,
      }
    },
    {
      name: 'chromium',
      testMatch: '**/spec/*.spec.ts', // Only match spec files, not setup files
      use: { 
        browserName: 'chromium',
        storageState: './MCP/storage-state/storageState.json',
      },
      dependencies: ['setup'],
    },
  ],
};

export default config;
