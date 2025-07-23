import { Page, Locator } from '@playwright/test';
import { Helper } from '../../utils/helper';

export default class LoginPage {
  readonly page: Page;
  readonly helper: Helper;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly nextButton: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new Helper(page);
    this.usernameInput = page.locator('input[name="loginfmt"]');
    this.nextButton = page.locator('#idSIButton9');
    this.passwordInput = page.locator('input[name="passwd"]');
    this.signInButton = page.locator('div.inline-block.button-item.ext-button-item');
  }
 
 
  async enterUsername(username: string) {
    await this.helper.waitForElement(this.usernameInput);
    await this.usernameInput.first().waitFor({ state : 'visible'});
    await this.usernameInput.fill(username);
  }
 
  async enterPassword(password: string) {
    await this.helper.waitForElement(this.passwordInput);
    await this.passwordInput.first().waitFor({ state : 'visible'});
    await this.passwordInput.fill(password);
  }
 
  async clickNextButton() {
    await this.nextButton.first().waitFor({ state : 'visible'});
    await this.nextButton.click();
  }

  async login( username: string, password: string) {
    await this.enterUsername(username);
    await this.clickNextButton();
    await this.helper.waitForAsyncTimeout();
    await this.enterPassword(password);
    await this.clickNextButton();
    await this.helper.waitForAsyncTimeout();
  }

}