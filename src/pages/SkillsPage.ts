import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, TIMEOUTS } from '@data/constants';
import logger from '@utils/logger';

export class SkillsPage extends BasePage {
  readonly addButton: Locator;
  readonly tableHeader: Locator;
  readonly tableRows: Locator;
  readonly form: Locator;
  readonly formNameInput: Locator;
  readonly formSaveButton: Locator;
  readonly formCancelButton: Locator;
  readonly formErrors: Locator;
  readonly addHeader: Locator;
  readonly editHeader: Locator;
  readonly editButtons: Locator;
  readonly deleteButtons: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.addButton = page.locator('button:has-text("Add")');
    this.tableHeader = page.locator('.oxd-table-header > div');
    this.tableRows = page.locator('.oxd-table-card');
    this.form = page.locator('.oxd-form');
    this.formNameInput = this.form.locator('input.oxd-input').first();
    this.formSaveButton = this.form.locator('button[type="submit"]');
    this.formCancelButton = this.form.locator('button:has-text("Cancel")');
    this.formErrors = this.form.locator('.oxd-input-field-error-message');
    this.addHeader = page.locator('h6:has-text("Add Skill")');
    this.editHeader = page.locator('h6:has-text("Edit Skill")');
    this.editButtons = page.locator('.oxd-table-cell-actions button:has(i.bi-pencil-fill)');
    this.deleteButtons = page.locator('.oxd-table-cell-actions button:has(i.bi-trash)');
    this.successMessage = page.locator('.oxd-toast');
  }

  get url(): string {
    return ROUTES.adminSkills;
  }

  async navigateFromAdmin(): Promise<void> {
    logger.info('Navigating to skills page');
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    await this.waitForLoaderToDisappear();
  }

  async isPageLoaded(): Promise<boolean> {
    await this.waitForLoaderToDisappear();
    return true;
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  getTableHeaders(): Promise<string[]> {
    return this.tableHeader.innerText().then((text) =>
      text
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
    );
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async getCellText(rowIndex: number, columnIndex: number): Promise<string> {
    const cell = this.tableRows.nth(rowIndex).locator('.oxd-table-cell').nth(columnIndex);
    return this.getText(cell);
  }

  async isAddButtonVisible(): Promise<boolean> {
    return this.isVisible(this.addButton);
  }

  async clickAdd(): Promise<void> {
    logger.info('Clicking Add button on skills page');
    await this.click(this.addButton);
    await this.waitForLoaderToDisappear();
  }

  async isAddFormDisplayed(): Promise<boolean> {
    await this.waitForLoaderToDisappear();
    return this.isVisible(this.addHeader);
  }

  async isEditFormDisplayed(): Promise<boolean> {
    await this.waitForLoaderToDisappear();
    return this.isVisible(this.editHeader);
  }

  async clickSave(): Promise<void> {
    await this.formSaveButton.click();
  }

  async clickCancel(): Promise<void> {
    await this.click(this.formCancelButton);
    await this.waitForLoaderToDisappear();
  }

  async fillSkillName(name: string): Promise<void> {
    logger.info(`Filling skill name: ${name}`);
    await this.fill(this.formNameInput, name);
  }

  async addSkill(name: string): Promise<void> {
    logger.info(`Adding skill: ${name}`);
    await this.fillSkillName(name);
    await this.clickSave();
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

  async getFormErrorMessages(): Promise<string[]> {
    const count = await this.formErrors.count();
    const messages: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.formErrors.nth(i).innerText();
      messages.push(text.trim());
    }
    return messages;
  }

  async isEditButtonVisible(rowIndex: number): Promise<boolean> {
    return this.isVisible(this.editButtons.nth(rowIndex));
  }

  async isDeleteButtonVisible(rowIndex: number): Promise<boolean> {
    return this.isVisible(this.deleteButtons.nth(rowIndex));
  }

  async clickEdit(rowIndex: number): Promise<void> {
    logger.info(`Editing skill at row ${rowIndex}`);
    await this.click(this.editButtons.nth(rowIndex));
    await this.waitForLoaderToDisappear();
  }

  async clickDelete(rowIndex: number): Promise<void> {
    logger.info(`Deleting skill at row ${rowIndex}`);
    await this.click(this.deleteButtons.nth(rowIndex));
  }

  async findSkillInTableByName(name: string): Promise<number> {
    const rowCount = await this.getRowCount();
    for (let i = 0; i < rowCount; i++) {
      const cellText = await this.getCellText(i, 1);
      if (cellText.trim().toLowerCase() === name.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }
}
