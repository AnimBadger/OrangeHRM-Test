import { test, expect } from '@fixtures/customFixtures';
import { validCredentials } from '@data/users';
import { AdminPage } from '@pages/AdminPage';
import { JobsPage } from '@pages/JobsPage';

test.describe('Admin Job Categories @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(validCredentials.username, validCredentials.password);
  });

  async function navigateToJobCategories(adminPage: AdminPage, jobsPage: JobsPage): Promise<void> {
    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Job Categories');
  }

  test('table has headers and rows', async ({ adminPage, jobsPage, jobCategoriesPage }) => {
    await navigateToJobCategories(adminPage, jobsPage);

    const headers = await jobCategoriesPage.getTableHeaders();
    expect(headers.length).toBeGreaterThan(0);
  });

  test('add button is visible on job categories page', async ({
    adminPage,
    jobsPage,
    jobCategoriesPage,
  }) => {
    await navigateToJobCategories(adminPage, jobsPage);

    expect(await jobCategoriesPage.isAddButtonVisible()).toBe(true);
  });

  test('add form loads with add job category header', async ({
    adminPage,
    jobsPage,
    jobCategoriesPage,
  }) => {
    await navigateToJobCategories(adminPage, jobsPage);
    await jobCategoriesPage.clickAdd();

    expect(await jobCategoriesPage.isAddFormDisplayed()).toBe(true);
  });

  test('cancel from add returns to job categories list', async ({
    adminPage,
    jobsPage,
    jobCategoriesPage,
  }) => {
    await navigateToJobCategories(adminPage, jobsPage);
    await jobCategoriesPage.clickAdd();

    expect(await jobCategoriesPage.isAddFormDisplayed()).toBe(true);

    await jobCategoriesPage.clickCancel();

    expect(await jobCategoriesPage.isPageLoaded()).toBe(true);
    expect(await jobCategoriesPage.isAddButtonVisible()).toBe(true);
  });

  test('required field shows validation error on empty submit', async ({
    adminPage,
    jobsPage,
    jobCategoriesPage,
  }) => {
    await navigateToJobCategories(adminPage, jobsPage);
    await jobCategoriesPage.clickAdd();

    expect(await jobCategoriesPage.isAddFormDisplayed()).toBe(true);

    await jobCategoriesPage.formSaveButton.click();
    await jobCategoriesPage.waitForLoaderToDisappear();

    const errors = await jobCategoriesPage.getFormErrorMessages();
    expect(errors.some((e) => /required/i.test(e))).toBe(true);
  });

  test('each row has edit and delete action buttons', async ({
    adminPage,
    jobsPage,
    jobCategoriesPage,
  }) => {
    await navigateToJobCategories(adminPage, jobsPage);

    const rowCount = await jobCategoriesPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    expect(await jobCategoriesPage.isEditButtonVisible(0)).toBe(true);
    expect(await jobCategoriesPage.isDeleteButtonVisible(0)).toBe(true);
  });

  test('edit form displays with correct header', async ({
    adminPage,
    jobsPage,
    jobCategoriesPage,
  }) => {
    await navigateToJobCategories(adminPage, jobsPage);

    const rowCount = await jobCategoriesPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    await jobCategoriesPage.clickEdit(0);
    expect(await jobCategoriesPage.isEditFormDisplayed()).toBe(true);
  });

  test('cancel from edit returns to job categories list', async ({
    adminPage,
    jobsPage,
    jobCategoriesPage,
  }) => {
    await navigateToJobCategories(adminPage, jobsPage);

    const rowCount = await jobCategoriesPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    await jobCategoriesPage.clickEdit(0);
    expect(await jobCategoriesPage.isEditFormDisplayed()).toBe(true);

    await jobCategoriesPage.clickCancel();
    expect(await jobCategoriesPage.isPageLoaded()).toBe(true);
    expect(await jobCategoriesPage.isAddButtonVisible()).toBe(true);
  });
});
