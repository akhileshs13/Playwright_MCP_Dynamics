import { Page } from '@playwright/test';
import LoginPage from './components/loginPage';
import { HomePage } from './components/homePage';
import { CasesPage } from './components/services/cases';

export class PageObjectManager {
  private homePage?: HomePage;
  private loginPage?: LoginPage;
  private casesPage?: CasesPage;

  constructor(private page: Page) {}

  getLoginPage(): LoginPage {
    if (!this.loginPage) {
      this.loginPage = new LoginPage(this.page);
    }
    return this.loginPage;
  }

  getHomePage(): HomePage {
    if (!this.homePage) {
      this.homePage = new HomePage(this.page);
    }
    return this.homePage;
  }

  getCasesPage(): CasesPage {
    if (!this.casesPage) {
      this.casesPage = new CasesPage(this.page);
    }
    return this.casesPage;
  }
}