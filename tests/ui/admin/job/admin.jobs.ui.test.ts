import { test, expect } from '@fixtures/customFixtures';
import { DataGenerator } from '@utils/dataGenerator';
import { ROUTES, MESSAGES } from '@data/constants';

test.describe('Admin Jobs @ui', () => {
  test('top bar has job menu item', async ({ adminPage }) => {
    await adminPage.navigate();
    const menuTexts = await adminPage.getAdminMenuTexts();
    expect(menuTexts).toContain('Job');
  });

  test('job dropdown displays all sub-items', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');

    const subItems = await jobsPage.getJobSubMenuTexts();
    expect(subItems).toContain('Job Titles');
    expect(subItems).toContain('Pay Grades');
    expect(subItems).toContain('Employment Status');
    expect(subItems).toContain('Job Categories');
    expect(subItems).toContain('Work Shifts');
  });

  test('job titles page navigates to correct url', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');

    expect(await jobsPage.isPageLoaded()).toBe(true);
    expect(await jobsPage.getCurrentUrl()).toContain(ROUTES.adminJobTitles);
  });

  test('pay grades page navigates to correct url', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Pay Grades');

    expect(await jobsPage.isPageLoaded()).toBe(true);
    expect(await jobsPage.getCurrentUrl()).toContain(ROUTES.adminPayGrades);
  });

  test('employment status page navigates to correct url', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Employment Status');

    expect(await jobsPage.isPageLoaded()).toBe(true);
    expect(await jobsPage.getCurrentUrl()).toContain(ROUTES.adminEmploymentStatus);
  });

  test('job categories page navigates to correct url', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Categories');

    expect(await jobsPage.isPageLoaded()).toBe(true);
    expect(await jobsPage.getCurrentUrl()).toContain(ROUTES.adminJobCategories);
  });

  test('work shifts page navigates to correct url', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Work Shifts');

    expect(await jobsPage.isPageLoaded()).toBe(true);
    expect(await jobsPage.getCurrentUrl()).toContain(ROUTES.adminWorkShifts);
  });

  test('add button is visible on job titles page', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');

    expect(await jobsPage.isAddButtonVisible()).toBe(true);
  });

  test('job titles table displays expected columns', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');

    const headers = await jobsPage.getTableHeaders();
    expect(headers).toContain('Job Titles');
    expect(headers).toContain('Job Description');
  });

  test('each row has edit and delete action buttons', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');

    const rowCount = await jobsPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);

    expect(await jobsPage.isEditButtonVisible(0)).toBe(true);
    expect(await jobsPage.isDeleteButtonVisible(0)).toBe(true);
  });

  test('add form loads with correct header', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');
    await jobsPage.clickAdd();

    expect(await jobsPage.isAddFormDisplayed()).toBe(true);
  });

  test('cancel from add returns to job titles list', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');
    await jobsPage.clickAdd();

    expect(await jobsPage.isAddFormDisplayed()).toBe(true);

    await jobsPage.clickCancel();

    expect(await jobsPage.isPageLoaded()).toBe(true);
    expect(await jobsPage.isAddButtonVisible()).toBe(true);
  });

  test('adds a new job title and appears in table', async ({ jobsPage, adminPage }) => {
    const title = `QA_${DataGenerator.generateRandomString(6)}`;
    const description = `Description for ${title}`;

    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');
    await jobsPage.clickAdd();

    expect(await jobsPage.isAddFormDisplayed()).toBe(true);

    await jobsPage.addJobTitle({ title, description });

    const successMsg = await jobsPage.getSuccessMessage();
    expect(successMsg).toBeTruthy();

    await jobsPage.navigateFromAdmin();

    const rowIndex = await jobsPage.findJobInTableByTitle(title);
    expect(rowIndex).toBeGreaterThanOrEqual(0);
  });

  test('edit form loads with pre-populated title', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');

    const firstTitle = await jobsPage.getCellText(0, 1);

    await jobsPage.clickEdit(0);
    expect(await jobsPage.isEditFormDisplayed()).toBe(true);

    const inputValue = await jobsPage.formTitleInput.inputValue();
    expect(inputValue.toLowerCase()).toBe(firstTitle.toLowerCase());

    await jobsPage.clickCancel();
    expect(await jobsPage.isPageLoaded()).toBe(true);
  });

  test('required field shows validation error on empty submit', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');
    await jobsPage.clickAdd();

    expect(await jobsPage.isAddFormDisplayed()).toBe(true);

    await jobsPage.formSaveButton.click();

    const errors = await jobsPage.getFormErrorMessages();
    expect(errors.some((e) => /required/i.test(e))).toBe(true);
  });

  test('cancel from edit returns to job titles list', async ({ jobsPage, adminPage }) => {
    await adminPage.navigate();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');

    await jobsPage.clickEdit(0);
    expect(await jobsPage.isEditFormDisplayed()).toBe(true);

    await jobsPage.clickCancel();
    expect(await jobsPage.isPageLoaded()).toBe(true);
    expect(await jobsPage.isAddButtonVisible()).toBe(true);
  });

  test('edit job title successfully updates the record', async ({ jobsPage, adminPage }) => {
    const originalTitle = `QA_${DataGenerator.generateRandomString(6)}`;
    const updatedTitle = `QA_${DataGenerator.generateRandomString(6)}`;

    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');

    await jobsPage.clickAdd();
    await jobsPage.addJobTitle({ title: originalTitle });

    const addMsg = await jobsPage.getSuccessMessage();
    expect(addMsg).toBeTruthy();

    await jobsPage.navigateFromAdmin();

    const rowIndex = await jobsPage.findJobInTableByTitle(originalTitle);
    expect(rowIndex).toBeGreaterThanOrEqual(0);

    await jobsPage.clickEdit(rowIndex);
    expect(await jobsPage.isEditFormDisplayed()).toBe(true);

    await jobsPage.fillJobTitle(updatedTitle);
    await jobsPage.clickSave();

    const editMsg = await jobsPage.getSuccessMessage();
    expect(editMsg).toBeTruthy();

    await jobsPage.navigateFromAdmin();

    const updatedRowIndex = await jobsPage.findJobInTableByTitle(updatedTitle);
    expect(updatedRowIndex).toBeGreaterThanOrEqual(0);
  });

  test('delete job title removes it from the table', async ({ jobsPage, adminPage }) => {
    const title = `QA_${DataGenerator.generateRandomString(6)}`;

    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');

    await jobsPage.clickAdd();
    await jobsPage.addJobTitle({ title });

    const addMsg = await jobsPage.getSuccessMessage();
    expect(addMsg).toBeTruthy();

    await jobsPage.navigateFromAdmin();

    const rowIndex = await jobsPage.findJobInTableByTitle(title);
    expect(rowIndex).toBeGreaterThanOrEqual(0);

    await jobsPage.clickDelete(rowIndex);

    const delMsg = await jobsPage.getSuccessMessage();
    expect(delMsg).toBeTruthy();

    await jobsPage.navigateFromAdmin();

    const deletedRowIndex = await jobsPage.findJobInTableByTitle(title);
    expect(deletedRowIndex).toBe(-1);
  });

  test('duplicate job title shows already exists error', async ({ jobsPage, adminPage }) => {
    const title = `QA_${DataGenerator.generateRandomString(6)}`;

    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Titles');

    await jobsPage.clickAdd();
    await jobsPage.addJobTitle({ title });

    const addMsg = await jobsPage.getSuccessMessage();
    expect(addMsg).toBeTruthy();

    await jobsPage.navigateFromAdmin();
    await jobsPage.clickAdd();
    await jobsPage.addJobTitle({ title });

    await expect(jobsPage.page.getByText(MESSAGES.alreadyExists)).toBeVisible();
  });
});
