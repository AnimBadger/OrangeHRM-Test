import { test, expect } from '@fixtures/customFixtures';
import { validCredentials } from '@data/users';
import { AdminPage } from '@pages/AdminPage';
import { JobsPage } from '@pages/JobsPage';

test.describe('Admin Pay Grades @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(validCredentials.username, validCredentials.password);
  });

  async function navigateToPayGrades(adminPage: AdminPage, jobsPage: JobsPage): Promise<void> {
    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Pay Grades');
  }

  test('table has headers and rows', async ({ adminPage, jobsPage, payGradesPage }) => {
    await navigateToPayGrades(adminPage, jobsPage);

    const headers = await payGradesPage.getTableHeaders();
    expect(headers.length).toBeGreaterThan(0);
  });

  test('add button is visible on pay grades page', async ({
    adminPage,
    jobsPage,
    payGradesPage,
  }) => {
    await navigateToPayGrades(adminPage, jobsPage);

    expect(await payGradesPage.isAddButtonVisible()).toBe(true);
  });

  test('add form loads with add pay grade header', async ({
    adminPage,
    jobsPage,
    payGradesPage,
  }) => {
    await navigateToPayGrades(adminPage, jobsPage);
    await payGradesPage.clickAdd();

    expect(await payGradesPage.isAddFormDisplayed()).toBe(true);
  });

  test('cancel from add returns to pay grades list', async ({
    adminPage,
    jobsPage,
    payGradesPage,
  }) => {
    await navigateToPayGrades(adminPage, jobsPage);
    await payGradesPage.clickAdd();

    expect(await payGradesPage.isAddFormDisplayed()).toBe(true);

    await payGradesPage.clickCancel();

    expect(await payGradesPage.isPageLoaded()).toBe(true);
    expect(await payGradesPage.isAddButtonVisible()).toBe(true);
  });

  test('required field shows validation error on empty submit', async ({
    adminPage,
    jobsPage,
    payGradesPage,
  }) => {
    await navigateToPayGrades(adminPage, jobsPage);
    await payGradesPage.clickAdd();

    expect(await payGradesPage.isAddFormDisplayed()).toBe(true);

    await payGradesPage.formSaveButton.click();
    await payGradesPage.waitForLoaderToDisappear();

    const errors = await payGradesPage.getFormErrorMessages();
    expect(errors.some((e) => /required/i.test(e))).toBe(true);
  });

  test('each row has edit and delete action buttons', async ({
    adminPage,
    jobsPage,
    payGradesPage,
  }) => {
    await navigateToPayGrades(adminPage, jobsPage);

    const rowCount = await payGradesPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    expect(await payGradesPage.isEditButtonVisible(0)).toBe(true);
    expect(await payGradesPage.isDeleteButtonVisible(0)).toBe(true);
  });

  test('edit form displays with correct header', async ({ adminPage, jobsPage, payGradesPage }) => {
    await navigateToPayGrades(adminPage, jobsPage);

    const rowCount = await payGradesPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    await payGradesPage.clickEdit(0);
    expect(await payGradesPage.isEditFormDisplayed()).toBe(true);
  });

  test('cancel from edit returns to pay grades list', async ({
    adminPage,
    jobsPage,
    payGradesPage,
  }) => {
    await navigateToPayGrades(adminPage, jobsPage);

    const rowCount = await payGradesPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    await payGradesPage.clickEdit(0);
    expect(await payGradesPage.isEditFormDisplayed()).toBe(true);

    await payGradesPage.clickCancel();
    expect(await payGradesPage.isPageLoaded()).toBe(true);
    expect(await payGradesPage.isAddButtonVisible()).toBe(true);
  });
});
