import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, TIMEOUTS } from '@data/constants';
import type { SystemUser } from '@typedefs/index';
import logger from '@utils/logger';

export class AdminPage extends BasePage {
  readonly adminHeader: Locator;
  readonly adminMenuItems: Locator;

  readonly searchUsernameInput: Locator;
  readonly searchUserRoleDropdown: Locator;
  readonly searchEmployeeNameInput: Locator;
  readonly searchStatusDropdown: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  readonly addUserButton: Locator;
  readonly tableHeader: Locator;
  readonly tableRows: Locator;
  readonly recordsFoundText: Locator;

  readonly noRecordsMessage: Locator;
  readonly pagination: Locator;

  readonly addUserForm: Locator;
  readonly formUserRoleDropdown: Locator;
  readonly formEmployeeNameInput: Locator;
  readonly formStatusDropdown: Locator;
  readonly formUsernameInput: Locator;
  readonly formPasswordInput: Locator;
  readonly formConfirmPasswordInput: Locator;
  readonly formSaveButton: Locator;
  readonly formCancelButton: Locator;
  readonly formErrors: Locator;
  readonly successMessage: Locator;
  readonly employeeAutocompleteOptions: Locator;
  readonly addUserHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.adminHeader = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.adminMenuItems = page.locator('.oxd-topbar-body-nav-tab-item');

    this.searchUsernameInput = page.locator('.oxd-table-filter-area .oxd-input');
    this.searchUserRoleDropdown = page
      .locator('.oxd-table-filter-area .oxd-select-text-input')
      .first();
    this.searchEmployeeNameInput = page.locator('input[placeholder="Type for hints..."]');
    this.searchStatusDropdown = page
      .locator('.oxd-table-filter-area .oxd-select-text-input')
      .nth(1);
    this.searchButton = page.locator('button[type="submit"]');
    this.resetButton = page.locator('button:has-text("Reset")');

    this.addUserButton = page.locator('button:has-text("Add")');
    this.tableHeader = page.locator('.oxd-table-header > div');
    this.tableRows = page.locator('.oxd-table-card');
    this.recordsFoundText = page.locator('.orangehrm-horizontal-padding');

    this.noRecordsMessage = page.locator('.oxd-table-card .oxd-text--span');
    this.pagination = page.locator('.oxd-pagination');

    this.addUserForm = page.locator('.oxd-form');
    this.formUserRoleDropdown = this.addUserForm.locator('.oxd-select-text-input').first();
    this.formEmployeeNameInput = page.locator('.oxd-autocomplete-wrapper input');
    this.formStatusDropdown = this.addUserForm.locator('.oxd-select-text-input').nth(1);
    this.formUsernameInput = this.addUserForm.locator('input.oxd-input').first();
    this.formPasswordInput = this.addUserForm.locator('input[type="password"]').first();
    this.formConfirmPasswordInput = this.addUserForm.locator('input[type="password"]').nth(1);
    this.formSaveButton = this.addUserForm.locator('button[type="submit"]');
    this.formCancelButton = this.addUserForm.locator('button:has-text("Cancel")');
    this.formErrors = this.addUserForm.locator('.oxd-input-field-error-message');
    this.successMessage = page.locator('.oxd-toast');
    this.employeeAutocompleteOptions = page.locator('.oxd-autocomplete-option');
    this.addUserHeader = page.locator('h6:has-text("Add User")');
  }

  get url(): string {
    return ROUTES.admin;
  }

  async isAdminPageLoaded(): Promise<boolean> {
    await this.waitForLoaderToDisappear();
    return this.isVisible(this.adminHeader);
  }

  async getAdminHeaderText(): Promise<string> {
    return this.getText(this.adminHeader);
  }

  async getAdminMenuTexts(): Promise<string[]> {
    await this.waitForLoaderToDisappear();
    const texts = await this.adminMenuItems.allTextContents();
    return texts.map((t) => t.trim()).filter(Boolean);
  }

  async clickAdminMenuItem(name: string): Promise<void> {
    const item = this.adminMenuItems.filter({ hasText: name });
    await this.click(item);
    await this.waitForLoaderToDisappear();
  }

  async searchByUsername(username: string): Promise<void> {
    logger.info(`Searching admin users by username: ${username}`);
    await this.fill(this.searchUsernameInput, username);
  }

  async selectUserRole(role: string): Promise<void> {
    await this.click(this.searchUserRoleDropdown);
    const option = this.page.getByRole('option', { name: role });
    await this.click(option);
  }

  async selectStatus(status: string): Promise<void> {
    await this.click(this.searchStatusDropdown);
    const option = this.page.getByRole('option', { name: status });
    await this.click(option);
  }

  async clickSearch(): Promise<void> {
    await this.click(this.searchButton);
    await this.waitForLoaderToDisappear();
  }

  async clickReset(): Promise<void> {
    await this.click(this.resetButton);
    await this.waitForLoaderToDisappear();
  }

  async loadSystemUsers(): Promise<void> {
    await this.clickSearch();
  }

  async getRecordsFoundText(): Promise<string> {
    return this.getText(this.recordsFoundText);
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

  async isAddUserButtonVisible(): Promise<boolean> {
    return this.isVisible(this.addUserButton);
  }

  async clickAddUser(): Promise<void> {
    await this.click(this.addUserButton);
    await this.waitForLoaderToDisappear();
  }

  async isPaginationVisible(): Promise<boolean> {
    return this.isVisible(this.pagination);
  }

  async isNoRecordsMessageVisible(): Promise<boolean> {
    return this.isVisible(this.noRecordsMessage);
  }

  async isAddUserFormDisplayed(): Promise<boolean> {
    await this.waitForLoaderToDisappear();
    return this.isVisible(this.addUserHeader);
  }

  async selectFormUserRole(role: string): Promise<void> {
    logger.info(`Selecting user role: ${role}`);
    await this.click(this.formUserRoleDropdown);
    const option = this.page.getByRole('option', { name: role });
    await this.click(option);
  }

  async selectFormStatus(status: string): Promise<void> {
    logger.info(`Selecting status: ${status}`);
    await this.click(this.formStatusDropdown);
    const option = this.page.getByRole('option', { name: status });
    await this.click(option);
  }

  async fillFormEmployeeName(name: string): Promise<void> {
    const searchName = name.split(' ')[0];
    logger.info(`Filling employee name: ${searchName}`);
    await this.formEmployeeNameInput.fill(searchName);
    await this.page
      .locator('.oxd-autocomplete-option:not(:has-text("Searching"))')
      .first()
      .waitFor({
        state: 'attached',
        timeout: TIMEOUTS.ACTION_TIMEOUT,
      });
    await this.page.waitForTimeout(500);
    const optionCount = await this.employeeAutocompleteOptions.count();
    if (optionCount > 0) {
      for (let i = 0; i < optionCount; i++) {
        const text = await this.employeeAutocompleteOptions.nth(i).innerText();
        if (text.trim() === name) {
          await this.employeeAutocompleteOptions.nth(i).click();
          return;
        }
      }
      await this.employeeAutocompleteOptions.first().click();
    }
  }

  async fillFormUsername(username: string): Promise<void> {
    logger.info(`Filling username: ${username}`);
    await this.fill(this.formUsernameInput, username);
  }

  async fillFormPassword(password: string): Promise<void> {
    await this.fill(this.formPasswordInput, password);
  }

  async fillFormConfirmPassword(password: string): Promise<void> {
    await this.fill(this.formConfirmPasswordInput, password);
  }

  async clickFormSave(): Promise<void> {
    await this.click(this.formSaveButton);
    await this.page.waitForTimeout(500);
  }

  async clickFormCancel(): Promise<void> {
    await this.click(this.formCancelButton);
    await this.waitForLoaderToDisappear();
  }

  async addSystemUser(user: SystemUser, employeeName: string): Promise<void> {
    logger.info(`Adding system user: ${user.username}`);
    await this.selectFormUserRole(user.userRole);
    await this.fillFormEmployeeName(employeeName);
    await this.selectFormStatus(user.status);
    await this.fillFormUsername(user.username);
    await this.fillFormPassword(user.password);
    await this.fillFormConfirmPassword(user.password);
    await this.clickFormSave();
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

  async findUserInTableByUsername(username: string): Promise<number> {
    const rowCount = await this.getRowCount();
    for (let i = 0; i < rowCount; i++) {
      const cellText = await this.getCellText(i, 1);
      if (cellText.trim().toLowerCase() === username.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }
}
