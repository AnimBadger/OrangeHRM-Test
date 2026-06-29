import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, TIMEOUTS } from '@data/constants';
import logger from '@utils/logger';

export class OrganizationPage extends BasePage {
  readonly pageHeader: Locator;
  readonly adminHeader: Locator;
  readonly adminMenuItems: Locator;
  readonly orgSubMenuItems: Locator;

  readonly orgSubItems: Record<string, string>;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.adminHeader = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.adminMenuItems = page.locator('.oxd-topbar-body-nav-tab-item');
    this.orgSubMenuItems = page.locator('.oxd-topbar-body-nav-tab-link');

    this.orgSubItems = {
      'General Information': ROUTES.adminOrganizationGeneralInfo,
      Locations: ROUTES.adminLocations,
      Structure: ROUTES.adminOrganizationStructure,
    };
  }

  get url(): string {
    return ROUTES.adminOrganizationGeneralInfo;
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

  async getOrgSubMenuTexts(): Promise<string[]> {
    await this.page.waitForTimeout(300);
    const texts = await this.orgSubMenuItems.allTextContents();
    return texts.map((t) => t.trim()).filter(Boolean);
  }

  async clickOrgSubMenuItem(name: string): Promise<void> {
    logger.info(`Clicking organization sub-menu item: ${name}`);
    await this.page.waitForTimeout(300);
    const item = this.orgSubMenuItems.filter({ hasText: name });
    await item.first().waitFor({ state: 'visible', timeout: TIMEOUTS.ACTION_TIMEOUT });
    await item.first().click();
    await this.waitForLoaderToDisappear();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
