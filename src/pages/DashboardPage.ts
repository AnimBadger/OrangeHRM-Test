import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, LABELS } from '@data/constants';

export class DashboardPage extends BasePage {
  readonly dashboardHeader: Locator;
  readonly quickLaunchItems: Locator;
  readonly employeeDistributionChart: Locator;
  readonly buzzWidget: Locator;
  readonly buzzPostCards: Locator;
  readonly userDropdown: Locator;
  readonly profileImage: Locator;
  readonly profileName: Locator;
  readonly dropdownMenu: Locator;
  readonly aboutOption: Locator;
  readonly supportOption: Locator;
  readonly changePasswordOption: Locator;
  readonly logoutOption: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeader = page.locator('.oxd-topbar-header-title');
    this.quickLaunchItems = page.locator('.oxd-grid-item');
    this.employeeDistributionChart = page.locator('.emp-distribution');
    this.buzzWidget = page.locator('.orangehrm-buzz-widget');
    this.buzzPostCards = page.locator('.orangehrm-buzz-widget-card');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.profileImage = this.userDropdown.locator('img');
    this.profileName = page.locator('.oxd-userdropdown-name');
    this.dropdownMenu = page.locator('.oxd-dropdown-menu');
    this.aboutOption = this.dropdownMenu.locator('a:has-text("About")');
    this.supportOption = this.dropdownMenu.locator('a:has-text("Support")');
    this.changePasswordOption = this.dropdownMenu.locator('a:has-text("Change Password")');
    this.logoutOption = this.dropdownMenu.locator('a:has-text("Logout")');
  }

  get url(): string {
    return ROUTES.dashboard;
  }

  async logout(): Promise<void> {
    await this.openUserDropdown();
    await this.click(this.logoutOption);
  }

  async openUserDropdown(): Promise<void> {
    await this.click(this.userDropdown);
  }

  async isProfileImageVisible(): Promise<boolean> {
    return this.isVisible(this.profileImage);
  }

  async getProfileName(): Promise<string> {
    return this.getText(this.profileName);
  }

  async getProfileImageSrc(): Promise<string | null> {
    return this.profileImage.getAttribute('src');
  }

  async isDropdownMenuVisible(): Promise<boolean> {
    return this.isVisible(this.dropdownMenu);
  }

  async getDropdownMenuOptions(): Promise<string[]> {
    const items = await this.dropdownMenu.locator('a').allTextContents();
    return items.map((text) => text.trim()).filter(Boolean);
  }

  async isDashboardDisplayed(): Promise<boolean> {
    await this.waitForLoaderToDisappear();
    return this.isVisible(this.dashboardHeader);
  }

  async verifyDashboardTitle(): Promise<void> {
    await this.verifyPageTitle(LABELS.applicationName);
  }

  async getQuickLaunchCount(): Promise<number> {
    return this.quickLaunchItems.count();
  }

  async getBuzzPostCount(): Promise<number> {
    return this.buzzPostCards.count();
  }

  async getBuzzPostText(index: number): Promise<string> {
    return this.getText(this.buzzPostCards.nth(index));
  }
}
