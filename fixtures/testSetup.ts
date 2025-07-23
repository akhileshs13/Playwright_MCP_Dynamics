import { test as base, Page } from '@playwright/test';
import { PageObjectManager } from '../page-objects/pageObjectManager'; // your path
import { Helper } from '../utils/helper';
import { navigateBasedOnEnv } from '../globals/envNavigator';

type MyFixtures = {
  pageObjectManager: PageObjectManager;
  helper: Helper;
};

export const test = base.extend<MyFixtures>({
  pageObjectManager: async ({ page }, use) => {
    const pom = new PageObjectManager(page);
    await use(pom);
  },

  helper: async ({ page }, use) => {
    const helper = new Helper(page);
    await helper.waitForAsyncTimeout();
    await use(helper);
  }
});

test.beforeEach(async ({ page, pageObjectManager }) => {
  const helper = new Helper(page);
  await helper.waitForAsyncTimeout();
  await navigateBasedOnEnv(page, helper, pageObjectManager);
  await pageObjectManager.getCasesPage().clickCasesLink();
});

export { expect } from '@playwright/test';
