import { Locator, Page } from "@playwright/test";
import logger from "./logger";

export class Helper {
  constructor(private page: Page) { }


  async waitForAsyncTimeout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  async waitForSpecificAsyncTimeout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 8000));
  }

  async waitForElement(locator: Locator, timeout: number = 6000): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
    } catch (error) {
      logger.error(`Element not visible within ${timeout}ms:`, error);
      throw error;
    }
  }

  async waitFor(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async closeSignInPopupIfPresent(): Promise<void> {
  const popupCloseBtn = this.page.locator('button[data-id="dialogCloseIconButton"]');
  const popupContainer = this.page.locator('[id^="modalDialogRoot_"]'); // dynamic popup root
 
  if (await popupCloseBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await popupCloseBtn.click({force: true});
    await popupContainer.waitFor({ state: 'detached', timeout: 5000 });
    logger.info('✅ Closed blocking popup');
  }
}

  async scrollToRight(): Promise<void> {
    await this.page.evaluate(() => {
      const scrollContainer = document.querySelector('.ag-body-horizontal-scroll-viewport');
      scrollContainer?.scrollTo({ left: scrollContainer.scrollWidth, behavior: 'smooth' });
    });
  }

  // Utility to generate a random alphabetic suffix
  async generateRandomString(length: number): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return await Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  // Utility to generate a random emailIds
  async generateRandomEmail(prefix = 'Auto'): Promise<string> {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${randomString}@test.com`;
  }
}