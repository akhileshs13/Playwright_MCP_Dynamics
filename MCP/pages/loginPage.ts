import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    // If already on main page, skip login
    if (this.page.url().includes('main.aspx')) {
      await this.closePopups();
      await expect(this.page).toHaveURL(/main\.aspx/);
      return;
    }
    // Wait for email input and fill if present
    if (await this.page.isVisible('input[type="email"]', { timeout: 10000 }).catch(() => false)) {
      await this.page.fill('input[type="email"]', username);
      await this.page.click('input[type="submit"]');
      // Wait for password input and fill
      await this.page.waitForSelector('input[type="password"]', { timeout: 30000 });
      await this.page.fill('input[type="password"]', password);
      await this.page.click('input[type="submit"]');
      // Wait for "Stay signed in" prompt and click Yes if present
      try {
        await this.page.waitForSelector('input[type="submit"][value="Yes"]', { timeout: 10000 });
        await this.page.click('input[type="submit"][value="Yes"]');
      } catch (e) {
        // If not present, continue
      }
    }
    // Close any popups/dialogs
    await this.closePopups();
    // Wait for main page to load
    await this.page.waitForURL(/main\.aspx/, { timeout: 30000 });
    await expect(this.page).toHaveURL(/main\.aspx/);
  }

  async closePopups() {
    // Try to close any popups/dialogs that may appear
    const closeSelectors = [
      '[aria-label="Close"]',
      '[title="Close"]',
      '.popup-close',
      '.ms-Dialog-button--close',
      '.close',
    ];
    for (const selector of closeSelectors) {
      if (await this.page.isVisible(selector)) {
        await this.page.click(selector);
      }
    }
  }
}
