import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, LABELS } from '@data/constants';
import logger from '@utils/logger';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly orangeHrmLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
    this.orangeHrmLogo = page.locator('.orangehrm-login-branding img');
  }

  get url(): string {
    return ROUTES.login;
  }

  async login(username: string, password: string): Promise<void> {
    logger.info(`Logging in with username: ${username}`);
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForLoaderToDisappear();
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async isLoginPageDisplayed(): Promise<boolean> {
    return this.isVisible(this.orangeHrmLogo);
  }

  async verifyLoginPageTitle(): Promise<void> {
    await this.verifyPageTitle(LABELS.applicationName);
  }
}
