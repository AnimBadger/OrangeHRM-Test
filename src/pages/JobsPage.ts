import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, TIMEOUTS } from '@data/constants';
import type { JobTitle } from '@typedefs/index';
import logger from '@utils/logger';

export class JobsPage extends BasePage {
  readonly pageHeader: Locator;
  readonly adminHeader: Locator;
  readonly adminMenuItems: Locator;
  readonly jobSubMenuItems: Locator;

  readonly addButton: Locator;
  readonly tableHeader: Locator;
  readonly tableRows: Locator;

  readonly form: Locator;
  readonly formTitleInput: Locator;
  readonly formDescriptionInput: Locator;
  readonly formNoteInput: Locator;
  readonly formSaveButton: Locator;
  readonly formCancelButton: Locator;
  readonly formErrors: Locator;
  readonly addHeader: Locator;
  readonly editHeader: Locator;

  readonly editButtons: Locator;
  readonly deleteButtons: Locator;
  readonly successMessage: Locator;

  readonly jobSubItems: Record<string, string>;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.adminHeader = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.adminMenuItems = page.locator('.oxd-topbar-body-nav-tab-item');
    this.jobSubMenuItems = page.locator('.oxd-topbar-body-nav-tab-link');

    this.addButton = page.locator('button:has-text("Add")');
    this.tableHeader = page.locator('.oxd-table-header > div');
    this.tableRows = page.locator('.oxd-table-card');

    this.form = page.locator('.oxd-form');
    this.formTitleInput = this.form.locator('input.oxd-input');
    this.formDescriptionInput = this.form.locator('textarea').first();
    this.formNoteInput = this.form.locator('textarea').nth(1);
    this.formSaveButton = this.form.locator('button[type="submit"]');
    this.formCancelButton = this.form.locator('button:has-text("Cancel")');
    this.formErrors = this.form.locator('.oxd-input-field-error-message');
    this.addHeader = page.locator('h6:has-text("Add Job Title")');
    this.editHeader = page.locator('h6:has-text("Edit Job Title")');

    this.editButtons = page.locator('.oxd-table-cell-actions button:has(i.bi-pencil-fill)');
    this.deleteButtons = page.locator('.oxd-table-cell-actions button:has(i.bi-trash)');
    this.successMessage = page.locator('.oxd-toast');

    this.jobSubItems = {
      'Job Titles': ROUTES.adminJobTitles,
      'Pay Grades': ROUTES.adminPayGrades,
      'Employment Status': ROUTES.adminEmploymentStatus,
      'Job Categories': ROUTES.adminJobCategories,
      'Work Shifts': ROUTES.adminWorkShifts,
    };
  }

  get url(): string {
    return ROUTES.adminJobTitles;
  }

  async navigateFromAdmin(): Promise<void> {
    logger.info('Navigating to job titles page via admin menu');
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    await this.waitForLoaderToDisappear();
  }

  async isPageLoaded(): Promise<boolean> {
    await this.waitForLoaderToDisappear();
    return this.isVisible(this.pageHeader);
  }

  async getPageHeaderText(): Promise<string> {
    return this.getText(this.pageHeader);
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

  async getJobSubMenuTexts(): Promise<string[]> {
    await this.page.waitForTimeout(300);
    const texts = await this.jobSubMenuItems.allTextContents();
    return texts.map((t) => t.trim()).filter(Boolean);
  }

  async clickJobSubMenuItem(name: string): Promise<void> {
    logger.info(`Clicking job sub-menu item: ${name}`);
    await this.page.waitForTimeout(300);
    const item = this.jobSubMenuItems.filter({ hasText: name });
    await item.first().waitFor({ state: 'visible', timeout: TIMEOUTS.ACTION_TIMEOUT });
    await item.first().click();
    await this.waitForLoaderToDisappear();
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
    logger.info('Clicking Add button on jobs page');
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

  async fillJobTitle(title: string): Promise<void> {
    logger.info(`Filling job title: ${title}`);
    await this.fill(this.formTitleInput, title);
  }

  async fillJobDescription(description: string): Promise<void> {
    await this.fill(this.formDescriptionInput, description);
  }

  async fillJobNote(note: string): Promise<void> {
    await this.fill(this.formNoteInput, note);
  }

  async clickSave(): Promise<void> {
    await this.formSaveButton.click();
  }

  async clickCancel(): Promise<void> {
    await this.click(this.formCancelButton);
    await this.waitForLoaderToDisappear();
  }

  async addJobTitle(job: JobTitle): Promise<void> {
    logger.info(`Adding job title: ${job.title}`);
    await this.fillJobTitle(job.title);
    if (job.description) {
      await this.fillJobDescription(job.description);
    }
    if (job.note) {
      await this.fillJobNote(job.note);
    }
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
    logger.info(`Editing job at row ${rowIndex}`);
    await this.click(this.editButtons.nth(rowIndex));
    await this.waitForLoaderToDisappear();
  }

  async clickDelete(rowIndex: number): Promise<void> {
    logger.info(`Deleting job at row ${rowIndex}`);
    await this.click(this.deleteButtons.nth(rowIndex));
  }

  async findJobInTableByTitle(title: string): Promise<number> {
    const rowCount = await this.getRowCount();
    for (let i = 0; i < rowCount; i++) {
      const cellText = await this.getCellText(i, 1);
      if (cellText.trim().toLowerCase() === title.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }
}
