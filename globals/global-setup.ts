import { FullConfig, chromium, firefox, webkit, Browser, BrowserType } from '@playwright/test';
import LoginPage from '../page-objects/components/loginPage';
import logger from '../utils/logger';
import { Helper } from '../utils/helper';
import * as dotenv from 'dotenv';
import path from 'path';
import * as base from "@playwright/test";
import { attachGlobalPopupHandler } from '../utils/autoPopupCloser'; // Add this import

const envFile = process.env.ENV_FILE || '.env'
dotenv.config({ path: path.resolve(__dirname, `../env.test/${envFile}`)});

let skipGlobalSetup = false;
if (process.env.SKIP_GLOBAL_SETUP === 'true') {
  console.log('⏭️  Skipping global setup for recordedTest.spec.ts');
  skipGlobalSetup = true;
}

let loginPage: LoginPage;
const authFile = './storage-state/storageState.json';
const orgUrl = process.env.DYN365_ORGURL ?? '';
const username = process.env.DYN365_USERNAME ?? '';
const password = process.env.DYN365_PASSWORD ?? '';

function getBrowserType(name: string): BrowserType<Browser> {
  // Use chromium for Edge automation, as Playwright does not support Edge directly via _electron
  if (name === 'edge') return chromium;
  if (name === 'webkit') return webkit;
  if (name === 'firefox') return firefox;
  return chromium;
}

async function globalSetup(config: FullConfig): Promise<void> {
  // Only run if local
  const targetEnv = process.env.TARGET_ENV;
  if (targetEnv && targetEnv !== 'LOCAL') {
    throw new Error('global-setup.ts should only be used for local development (TARGET_ENV=LOCAL)');
  }

  const project = config.projects[0];
  const launchOptions = project.use.launchOptions || {};
  const browserName = project.use.browserName || 'chromium';
  const browserType = getBrowserType(browserName);

  const browser = await browserType.launch({
    ...launchOptions,
    headless: false, // force non-headless for local, as in local-setup.ts
  });

  const page = await browser.newPage();
  const helper = new Helper(page);
  loginPage = new LoginPage(page);
  await page.goto(orgUrl);
  logger.info("Navigating to the CRM application");
  await helper.waitForAsyncTimeout();
  await loginPage.login(username, password);
  logger.info("Successfully loggedIn with the application")
  await page.context().storageState({ path: authFile });
  await browser.close();
}


const test = base.test.extend({
  page: async (_, use, testInfo) => {
    const targetEnv = process.env.TARGET_ENV;
    if (targetEnv && targetEnv !== 'LOCAL') {
      throw new Error('local-setup.ts should only be used for local development (TARGET_ENV=LOCAL)');
    }

    // Get browserName from test project config or fallback to chromium
    const browserName = testInfo.project.use.browserName || 'chromium';
    const browserType = getBrowserType(browserName);

    const browser = await browserType.launch({ headless: false });
    const context = await browser.newContext({ storageState: authFile, ignoreHTTPSErrors: true });
    const localPage = await context.newPage();
    attachGlobalPopupHandler(localPage);
    await use(localPage);
    await localPage.close();
    await browser.close();
  }
});

export { test };
export default skipGlobalSetup ? async () => {} : globalSetup;