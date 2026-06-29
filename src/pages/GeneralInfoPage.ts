import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, TIMEOUTS } from '@data/constants';
import logger from '@utils/logger';

export class GeneralInfoPage extends BasePage {
  readonly pageHeader: Locator;
  readonly form: Locator;
  readonly formOrganizationName: Locator;
  readonly formSaveButton: Locator;
  readonly formCancelButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.form = page.locator('.oxd-form');
    this.formOrganizationName = this.form.locator('input.oxd-input').first();
    this.formSaveButton = this.form.locator('button[type="submit"]');
    this.formCancelButton = this.form.locator('button:has-text("Cancel")');
    this.successMessage = page.locator('.oxd-toast');
  }

  get url(): string {
    return ROUTES.adminOrganizationGeneralInfo;
  }

  async isPageLoaded(): Promise<boolean> {
    await this.waitForLoaderToDisappear();
    return this.isVisible(this.pageHeader);
  }

  async getHeaderText(): Promise<string> {
    return this.getText(this.pageHeader);
  }

  async getOrganizationNameValue(): Promise<string> {
    return this.formOrganizationName.inputValue();
  }

  async clickSave(): Promise<void> {
    logger.info('Saving organization general information');
    await this.formSaveButton.click();
  }

  async getSuccessMessage(): Promise<string | null> {
    try {
      const toast = this.page.locator('.oxd-toast');
      await toast.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
      const text = await toast.innerText();
      return text.trim();
    } catch {
      return null;
    }
  }
}
