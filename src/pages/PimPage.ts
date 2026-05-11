import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '@data/constants';
import type { Employee } from '@typedefs/index';
import logger from '@utils/logger';

export class PimPage extends BasePage {
  readonly addEmployeeButton: Locator;
  readonly employeeListTab: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly employeeNameField: Locator;
  readonly personalDetailsHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.addEmployeeButton = page.locator('a:has-text("Add Employee")');
    this.employeeListTab = page.locator('a:has-text("Employee List")');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('.oxd-grid-item .oxd-input');
    this.saveButton = page.locator('button[type="submit"]');
    this.searchButton = page.locator('button[type="submit"]:has-text("Search")');
    this.resetButton = page.locator('button:has-text("Reset")');
    this.employeeNameField = page.locator('input[placeholder="Type for hints..."]');
    this.personalDetailsHeader = page.locator('h6:has-text("Personal Details")');
  }

  get url(): string {
    return ROUTES.pim;
  }

  async addEmployee(employee: Employee): Promise<void> {
    logger.info(`Adding employee: ${employee.firstName} ${employee.lastName}`);
    await this.click(this.addEmployeeButton);
    await this.fill(this.firstNameInput, employee.firstName);
    if (employee.middleName) {
      await this.fill(this.middleNameInput, employee.middleName);
    }
    await this.fill(this.lastNameInput, employee.lastName);
    if (employee.employeeId) {
      await this.fill(this.employeeIdInput, employee.employeeId);
    }
    await this.click(this.saveButton);
    await this.waitForLoaderToDisappear();
  }

  async searchEmployee(employeeName: string): Promise<void> {
    logger.info(`Searching for employee: ${employeeName}`);
    await this.fill(this.employeeNameField, employeeName);
    await this.click(this.searchButton);
    await this.waitForLoaderToDisappear();
  }

  async isPersonalDetailsDisplayed(): Promise<boolean> {
    return this.isVisible(this.personalDetailsHeader);
  }
}
