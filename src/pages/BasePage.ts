import { Page, Locator, expect } from '@playwright/test';
import logger from '@utils/logger';
import { TIMEOUTS } from '@data/constants';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract get url(): string;

  async navigate(): Promise<void> {
    logger.info(`Navigating to: ${this.url}`);
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForElement(element: Locator, timeout = TIMEOUTS.MEDIUM): Promise<void> {
    await element.waitFor({ state: 'visible', timeout });
  }

  async click(element: Locator): Promise<void> {
    await this.waitForElement(element);
    await element.click();
  }

  async fill(element: Locator, text: string): Promise<void> {
    await this.waitForElement(element);
    await element.clear();
    await element.fill(text);
  }

  async getText(element: Locator): Promise<string> {
    await this.waitForElement(element);
    return (await element.textContent()) || '';
  }

  async isVisible(element: Locator, timeout = TIMEOUTS.SHORT): Promise<boolean> {
    try {
      await element.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async selectDropdownOption(dropdown: Locator, optionText: string): Promise<void> {
    await this.click(dropdown);
    const option = this.page.getByRole('option', { name: optionText });
    await this.click(option);
  }

  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async verifyUrl(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  protected get loader(): Locator {
    return this.page.locator('.oxd-loading-spinner');
  }

  async waitForLoaderToDisappear(): Promise<void> {
    if (await this.isVisible(this.loader, TIMEOUTS.SHORT)) {
      await this.loader.waitFor({ state: 'hidden', timeout: TIMEOUTS.MEDIUM });
    }
  }
}
