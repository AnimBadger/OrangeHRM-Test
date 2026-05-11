import { Page, Locator } from '@playwright/test';
import logger from '@utils/logger';

export class HeaderComponent {
  readonly page: Page;
  readonly profileIcon: Locator;
  readonly aboutButton: Locator;
  readonly logoutButton: Locator;
  readonly supportButton: Locator;
  readonly changePasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileIcon = page.locator('.oxd-userdropdown-tab');
    this.aboutButton = page.locator('a:has-text("About")');
    this.logoutButton = page.locator('a:has-text("Logout")');
    this.supportButton = page.locator('a:has-text("Support")');
    this.changePasswordButton = page.locator('a:has-text("Change Password")');
  }

  async logout(): Promise<void> {
    logger.info('Logging out via header dropdown');
    await this.profileIcon.click();
    await this.logoutButton.click();
  }
}
