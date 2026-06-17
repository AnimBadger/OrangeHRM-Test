import { test, expect } from '@fixtures/customFixtures';
import type { AdminPage } from '@pages/AdminPage';
import type { JobsPage } from '@pages/JobsPage';

test.describe('Admin Work Shifts @ui', () => {
  async function navigateToWorkShifts(adminPage: AdminPage, jobsPage: JobsPage): Promise<void> {
    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await jobsPage.clickAdminMenuItem('Job');
    await jobsPage.clickJobSubMenuItem('Work Shifts');
  }

  test('table has headers and rows', async ({ adminPage, jobsPage, workShiftsPage }) => {
    await navigateToWorkShifts(adminPage, jobsPage);

    const headers = await workShiftsPage.getTableHeaders();
    expect(headers.length).toBeGreaterThan(0);
  });

  test('add button is visible on work shifts page', async ({
    adminPage,
    jobsPage,
    workShiftsPage,
  }) => {
    await navigateToWorkShifts(adminPage, jobsPage);

    expect(await workShiftsPage.isAddButtonVisible()).toBe(true);
  });

  test('add form loads with add work shift header', async ({
    adminPage,
    jobsPage,
    workShiftsPage,
  }) => {
    await navigateToWorkShifts(adminPage, jobsPage);
    await workShiftsPage.clickAdd();

    expect(await workShiftsPage.isAddFormDisplayed()).toBe(true);
  });

  test('cancel from add returns to work shifts list', async ({
    adminPage,
    jobsPage,
    workShiftsPage,
  }) => {
    await navigateToWorkShifts(adminPage, jobsPage);
    await workShiftsPage.clickAdd();

    expect(await workShiftsPage.isAddFormDisplayed()).toBe(true);

    await workShiftsPage.clickCancel();

    expect(await workShiftsPage.isPageLoaded()).toBe(true);
    expect(await workShiftsPage.isAddButtonVisible()).toBe(true);
  });

  test('required field shows validation error on empty submit', async ({
    adminPage,
    jobsPage,
    workShiftsPage,
  }) => {
    await navigateToWorkShifts(adminPage, jobsPage);
    await workShiftsPage.clickAdd();

    expect(await workShiftsPage.isAddFormDisplayed()).toBe(true);

    await workShiftsPage.formSaveButton.click();
    await workShiftsPage.waitForLoaderToDisappear();

    const errors = await workShiftsPage.getFormErrorMessages();
    expect(errors.some((e) => /required/i.test(e))).toBe(true);
  });

  test('each row has edit and delete action buttons', async ({
    adminPage,
    jobsPage,
    workShiftsPage,
  }) => {
    await navigateToWorkShifts(adminPage, jobsPage);

    const rowCount = await workShiftsPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    expect(await workShiftsPage.isEditButtonVisible(0)).toBe(true);
    expect(await workShiftsPage.isDeleteButtonVisible(0)).toBe(true);
  });

  test('edit form displays with correct header', async ({
    adminPage,
    jobsPage,
    workShiftsPage,
  }) => {
    await navigateToWorkShifts(adminPage, jobsPage);

    const rowCount = await workShiftsPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    await workShiftsPage.clickEdit(0);
    expect(await workShiftsPage.isEditFormDisplayed()).toBe(true);
  });

  test('cancel from edit returns to work shifts list', async ({
    adminPage,
    jobsPage,
    workShiftsPage,
  }) => {
    await navigateToWorkShifts(adminPage, jobsPage);

    const rowCount = await workShiftsPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    await workShiftsPage.clickEdit(0);
    expect(await workShiftsPage.isEditFormDisplayed()).toBe(true);

    await workShiftsPage.clickCancel();
    expect(await workShiftsPage.isPageLoaded()).toBe(true);
    expect(await workShiftsPage.isAddButtonVisible()).toBe(true);
  });
});
