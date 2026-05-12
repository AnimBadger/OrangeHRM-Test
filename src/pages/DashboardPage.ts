import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, LABELS, SIDEBAR_MENU_ITEMS, BREADCRUMBS, TIMEOUTS } from '@data/constants';

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
  readonly sidebar: Locator;
  readonly sidebarToggleButton: Locator;
  readonly sidebarMenuItems: Locator;
  readonly sidebarHeader: Locator;
  readonly sidebarBrandLogo: Locator;
  readonly sidebarBrandBanner: Locator;
  readonly sidebarBrandLink: Locator;
  readonly searchInput: Locator;
  readonly searchContainer: Locator;
  readonly breadcrumbModule: Locator;
  readonly breadcrumbLevel: Locator;

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
    this.sidebar = page.locator('.oxd-sidepanel');
    this.sidebarToggleButton = page.locator('.oxd-main-menu-button');
    this.sidebarMenuItems = page.locator('.oxd-main-menu-item');
    this.sidebarHeader = page.locator('.oxd-sidepanel-header');
    this.sidebarBrandLogo = page.locator('.oxd-brand-logo img').first();
    this.sidebarBrandBanner = page.locator('.oxd-brand-banner img').first();
    this.sidebarBrandLink = page.locator('.oxd-sidepanel-header a');
    this.searchInput = page.locator('input[placeholder="Search"]');
    this.searchContainer = page.locator('.oxd-main-menu-search');
    this.breadcrumbModule = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.breadcrumbLevel = page.locator('.oxd-topbar-header-breadcrumb-level');
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

  async toggleSidebar(): Promise<void> {
    await this.click(this.sidebarToggleButton);
  }

  async isSidebarCollapsed(): Promise<boolean> {
    const cls = await this.sidebar.getAttribute('class');
    return cls?.includes('toggled') ?? false;
  }

  async getSidebarMenuTexts(): Promise<string[]> {
    const texts = await this.sidebarMenuItems.locator('.oxd-text').allTextContents();
    return texts.map((t) => t.trim()).filter(Boolean);
  }

  async clickSidebarMenuItem(name: string): Promise<void> {
    const item = this.sidebarMenuItems.filter({ hasText: name });
    await this.click(item);
  }

  async getSidebarMenuItemHref(name: string): Promise<string> {
    const item = this.sidebarMenuItems.filter({ hasText: name });
    return (await item.getAttribute('href')) || '';
  }

  getSidebarMenuRoutes(): Record<string, string> {
    return SIDEBAR_MENU_ITEMS;
  }

  async isBrandLogoVisible(): Promise<boolean> {
    return this.isVisible(this.sidebarBrandLogo);
  }

  async getBrandLogoSrc(): Promise<string | null> {
    return this.sidebarBrandLogo.getAttribute('src');
  }

  async getBrandLogoAlt(): Promise<string | null> {
    return this.sidebarBrandLogo.getAttribute('alt');
  }

  async getBrandLinkHref(): Promise<string | null> {
    return this.sidebarBrandLink.getAttribute('href');
  }

  async searchMenu(query: string): Promise<void> {
    await this.fill(this.searchInput, query);
  }

  async clearSearch(): Promise<void> {
    await this.fill(this.searchInput, '');
  }

  async getVisibleSidebarMenuTexts(): Promise<string[]> {
    await this.waitForLoaderToDisappear();
    const texts = await this.sidebarMenuItems.locator('.oxd-text').allTextContents();
    return texts.map((t) => t.trim()).filter(Boolean);
  }

  async getBreadcrumbModule(): Promise<string> {
    return (await this.breadcrumbModule.textContent()) || '';
  }

  async getBreadcrumbLevel(): Promise<string | null> {
    try {
      await this.breadcrumbLevel.waitFor({ state: 'attached', timeout: TIMEOUTS.SHORT });
      return (await this.breadcrumbLevel.textContent())?.trim() || null;
    } catch {
      return null;
    }
  }

  getBreadcrumbsConfig(): Record<string, { module: string; level?: string }> {
    return BREADCRUMBS;
  }
}
