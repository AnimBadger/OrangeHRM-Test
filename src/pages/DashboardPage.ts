import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, LABELS } from '@data/constants';

export class DashboardPage extends BasePage {
  readonly dashboardHeader: Locator;
  readonly quickLaunchItems: Locator;
  readonly employeeDistributionChart: Locator;
  readonly profileIcon: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeader = page.locator('.oxd-topbar-header-title');
    this.quickLaunchItems = page.locator('.oxd-grid-item');
    this.employeeDistributionChart = page.locator('.emp-distribution');
    this.profileIcon = page.locator('.oxd-userdropdown-tab');
    this.logoutButton = page.locator('a:has-text("Logout")');
  }

  get url(): string {
    return ROUTES.dashboard;
  }

  async logout(): Promise<void> {
    await this.click(this.profileIcon);
    await this.click(this.logoutButton);
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
}
