import { Page } from '@playwright/test';
import logger from '../utils/logger';
import type { Helper } from '../utils/helper'; // Adjust the path if needed

import dotenv from 'dotenv';
dotenv.config({ path: `env.test/${process.env.ENV_FILE}` });

interface PageObjectManager {
  getHomePage(): {
    clickPlaywrightTestingHubLink(): Promise<void>;
  };
}

export async function navigateBasedOnEnv(page: Page, helper: Helper, pageObjectManager: PageObjectManager): Promise<void> {
  const env = process.env.ENV_FILE;
  const orgUrl = process.env.DYN365_ORGURL;

  if (!env || !orgUrl) {
    throw new Error('Missing ENV_FILE Or It is not defined');
  }

  if (env === '.env') {
    await page.goto('./');
    await helper.waitForSpecificAsyncTimeout();
    await pageObjectManager.getHomePage().clickPlaywrightTestingHubLink();
    logger.info("Navigated to Playwright Testing POC HomePage")
  }
}