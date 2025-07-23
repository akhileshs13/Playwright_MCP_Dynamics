import { Page, Locator, FrameLocator } from '@playwright/test';
import logger from '../../utils/logger';
import { Helper } from '../../utils/helper';
import { retryAction } from '../../utils/retry-helper';
export class HomePage {
  readonly page: Page;
  readonly helper: Helper;
  readonly retryAction: typeof retryAction;
  readonly playwrightTestingHubLink: Locator;
  readonly frameElement: FrameLocator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new Helper(page);
    this.retryAction = retryAction;
    this.frameElement = page.frameLocator('iframe[title="AppLandingPage"]');
    this.playwrightTestingHubLink = this.frameElement.locator('div[data-type="app-title"][title="Playwright Testing POC"]');
  }

  /**
   * Clicks on the "Playwright Testing POC" link on the home page.
   *
   * This method waits for an asynchronous timeout, then attempts to hover over and click
   * the first instance of the Playwright Testing POC link element. The action is retried up to
   * 2 times with a 1000ms delay between attempts if it fails. Upon successful click, an info
   * log is recorded.
   *
   * @throws Will throw an error if the link cannot be clicked after the specified retries.
   * @returns {Promise<void>} A promise that resolves when the link has been successfully clicked.
   */
  async clickPlaywrightTestingHubLink(): Promise<void> {
    await this.helper.waitForAsyncTimeout();
    await retryAction(async () => {
      await this.playwrightTestingHubLink.first().hover();
      await this.playwrightTestingHubLink.first().click({ force: true });
    }, 2, 1000, 'Clicking Playwright Testing POC Link');
    logger.info("Successfully clicked on Playwright Testing POC Link");
  }

}