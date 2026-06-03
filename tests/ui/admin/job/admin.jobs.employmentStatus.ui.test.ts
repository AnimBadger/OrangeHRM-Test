import { test, expect } from '@fixtures/customFixtures';
import { validCredentials } from '@data/users';
import { AdminPage } from '@pages/AdminPage';
import { JobsPage } from '@pages/JobsPage';

test.describe('Admin Employment Status @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(validCredentials.username, validCredentials.password);
  });

  async function navigateToEmploymentStatus(
    adminPage: AdminPage,
    jobsPage: JobsPage,
  ): Promise<void> {
    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Employment Status');
  }

  test('table has headers and rows', async ({ adminPage, jobsPage, employmentStatusPage }) => {
    await navigateToEmploymentStatus(adminPage, jobsPage);

    const headers = await employmentStatusPage.getTableHeaders();
    expect(headers.length).toBeGreaterThan(0);
  });

  test('add button is visible on employment status page', async ({
    adminPage,
    jobsPage,
    employmentStatusPage,
  }) => {
    await navigateToEmploymentStatus(adminPage, jobsPage);

    expect(await employmentStatusPage.isAddButtonVisible()).toBe(true);
  });

  test('add form loads with add employment status header', async ({
    adminPage,
    jobsPage,
    employmentStatusPage,
  }) => {
    await navigateToEmploymentStatus(adminPage, jobsPage);
    await employmentStatusPage.clickAdd();

    expect(await employmentStatusPage.isAddFormDisplayed()).toBe(true);
  });

  test('cancel from add returns to employment status list', async ({
    adminPage,
    jobsPage,
    employmentStatusPage,
  }) => {
    await navigateToEmploymentStatus(adminPage, jobsPage);
    await employmentStatusPage.clickAdd();

    expect(await employmentStatusPage.isAddFormDisplayed()).toBe(true);

    await employmentStatusPage.clickCancel();

    expect(await employmentStatusPage.isPageLoaded()).toBe(true);
    expect(await employmentStatusPage.isAddButtonVisible()).toBe(true);
  });

  test('required field shows validation error on empty submit', async ({
    adminPage,
    jobsPage,
    employmentStatusPage,
  }) => {
    await navigateToEmploymentStatus(adminPage, jobsPage);
    await employmentStatusPage.clickAdd();

    expect(await employmentStatusPage.isAddFormDisplayed()).toBe(true);

    await employmentStatusPage.formSaveButton.click();
    await employmentStatusPage.waitForLoaderToDisappear();

    const errors = await employmentStatusPage.getFormErrorMessages();
    expect(errors.some((e) => /required/i.test(e))).toBe(true);
  });

  test('each row has edit and delete action buttons', async ({
    adminPage,
    jobsPage,
    employmentStatusPage,
  }) => {
    await navigateToEmploymentStatus(adminPage, jobsPage);

    const rowCount = await employmentStatusPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    expect(await employmentStatusPage.isEditButtonVisible(0)).toBe(true);
    expect(await employmentStatusPage.isDeleteButtonVisible(0)).toBe(true);
  });

  test('edit form displays with correct header', async ({
    adminPage,
    jobsPage,
    employmentStatusPage,
  }) => {
    await navigateToEmploymentStatus(adminPage, jobsPage);

    const rowCount = await employmentStatusPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    await employmentStatusPage.clickEdit(0);
    expect(await employmentStatusPage.isEditFormDisplayed()).toBe(true);
  });

  test('cancel from edit returns to employment status list', async ({
    adminPage,
    jobsPage,
    employmentStatusPage,
  }) => {
    await navigateToEmploymentStatus(adminPage, jobsPage);

    const rowCount = await employmentStatusPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    await employmentStatusPage.clickEdit(0);
    expect(await employmentStatusPage.isEditFormDisplayed()).toBe(true);

    await employmentStatusPage.clickCancel();
    expect(await employmentStatusPage.isPageLoaded()).toBe(true);
    expect(await employmentStatusPage.isAddButtonVisible()).toBe(true);
  });
});
