import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '@data/constants';
import logger from '@utils/logger';

export class StructurePage extends BasePage {
  readonly pageHeader: Locator;
  readonly treeNodes: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.treeNodes = page.locator('.oxd-tree-node');
    this.addButton = page.locator('button:has-text("Add")');
  }

  get url(): string {
    return ROUTES.adminOrganizationStructure;
  }

  async isPageLoaded(): Promise<boolean> {
    await this.waitForLoaderToDisappear();
    return this.isVisible(this.pageHeader);
  }

  async getHeaderText(): Promise<string> {
    return this.getText(this.pageHeader);
  }

  async getNodeCount(): Promise<number> {
    await this.waitForLoaderToDisappear();
    return this.treeNodes.count();
  }

  async isAddButtonVisible(): Promise<boolean> {
    logger.info('Checking if add button is visible on structure page');
    return this.isVisible(this.addButton);
  }
}
