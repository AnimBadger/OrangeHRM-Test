import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, TIMEOUTS } from '@data/constants';
import logger from '@utils/logger';

export class CorporateBrandingPage extends BasePage {
  readonly pageHeader: Locator;
  readonly primaryColorInput: Locator;
  readonly secondaryColorInput: Locator;
  readonly logoImageInput: Locator;
  readonly loginBackgroundInput: Locator;
  readonly form: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly successMessage: Locator;
  readonly primaryColorPreview: Locator;
  readonly secondaryColorPreview: Locator;
  readonly logoPreview: Locator;
  readonly loginBackgroundPreview: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.form = page.locator('.oxd-form');
    this.primaryColorInput = page.locator('input.oxd-color-input').first();
    this.secondaryColorInput = page.locator('input.oxd-color-input').nth(1);
    this.logoImageInput = page.locator('.oxd-file-input').first();
    this.loginBackgroundInput = page.locator('.oxd-file-input').nth(1);
    this.saveButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.successMessage = page.locator('.oxd-toast');
    this.primaryColorPreview = page.locator('.oxd-color-input').first();
    this.secondaryColorPreview = page.locator('.oxd-color-input').nth(1);
    this.logoPreview = page.locator('.oxd-file-input').first();
    this.loginBackgroundPreview = page.locator('.oxd-file-input').nth(1);
  }

  get url(): string {
    return ROUTES.adminCorporateBranding;
  }

  async isPageLoaded(): Promise<boolean> {
    await this.waitForLoaderToDisappear();
    return this.isVisible(this.form);
  }

  async getHeaderText(): Promise<string> {
    return this.getText(this.pageHeader);
  }

  async getPrimaryColorValue(): Promise<string> {
    return this.primaryColorInput.inputValue();
  }

  async getSecondaryColorValue(): Promise<string> {
    return this.secondaryColorInput.inputValue();
  }

  async setPrimaryColor(hex: string): Promise<void> {
    logger.info(`Setting primary color to: ${hex}`);
    await this.primaryColorInput.fill(hex);
  }

  async setSecondaryColor(hex: string): Promise<void> {
    logger.info(`Setting secondary color to: ${hex}`);
    await this.secondaryColorInput.fill(hex);
  }

  async clickSave(): Promise<void> {
    logger.info('Saving corporate branding settings');
    await this.saveButton.click();
    await this.waitForLoaderToDisappear();
  }

  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton);
    await this.waitForLoaderToDisappear();
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

  async isSuccessMessageVisible(): Promise<boolean> {
    return this.isVisible(this.page.locator('.oxd-toast'), TIMEOUTS.MEDIUM);
  }

  async uploadLogo(filePath: string): Promise<void> {
    logger.info(`Uploading logo: ${filePath}`);
    await this.logoImageInput.setInputFiles(filePath);
  }

  async uploadLoginBackground(filePath: string): Promise<void> {
    logger.info(`Uploading login background: ${filePath}`);
    await this.loginBackgroundInput.setInputFiles(filePath);
  }

  async clearLogo(): Promise<void> {
    await this.logoImageInput.setInputFiles([]);
  }

  async clearLoginBackground(): Promise<void> {
    await this.loginBackgroundInput.setInputFiles([]);
  }

  async isSaveButtonVisible(): Promise<boolean> {
    return this.isVisible(this.saveButton);
  }
}
