import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, TIMEOUTS } from '@data/constants';
import logger from '@utils/logger';

export class QualificationsPage extends BasePage {
  readonly pageHeader: Locator;
  readonly adminMenuItems: Locator;
  readonly qualSubMenuItems: Locator;

  readonly qualSubItems: Record<string, string>;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.adminMenuItems = page.locator('.oxd-topbar-body-nav-tab-item');
    this.qualSubMenuItems = page.locator('.oxd-topbar-body-nav-tab-link');

    this.qualSubItems = {
      Skills: ROUTES.adminSkills,
      Education: ROUTES.adminEducation,
      Licenses: ROUTES.adminLicenses,
      Languages: ROUTES.adminLanguages,
    };
  }

  get url(): string {
    return ROUTES.adminSkills;
  }

  async isPageLoaded(): Promise<boolean> {
    await this.waitForLoaderToDisappear();
    return this.isVisible(this.pageHeader);
  }

  async getAdminMenuTexts(): Promise<string[]> {
    await this.waitForLoaderToDisappear();
    const texts = await this.adminMenuItems.allTextContents();
    return texts.map((t) => t.trim()).filter(Boolean);
  }

  async clickAdminMenuItem(name: string): Promise<void> {
    await this.waitForLoaderToDisappear();
    const item = this.adminMenuItems.filter({ hasText: name });
    await this.click(item);
  }

  async getQualSubMenuTexts(): Promise<string[]> {
    await this.page.waitForTimeout(300);
    const texts = await this.qualSubMenuItems.allTextContents();
    return texts.map((t) => t.trim()).filter(Boolean);
  }

  async clickQualSubMenuItem(name: string): Promise<void> {
    logger.info(`Clicking qualifications sub-menu item: ${name}`);
    await this.page.waitForTimeout(300);
    const item = this.qualSubMenuItems.filter({ hasText: name });
    await item.first().waitFor({ state: 'visible', timeout: TIMEOUTS.ACTION_TIMEOUT });
    await item.first().click();
    await this.waitForLoaderToDisappear();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
