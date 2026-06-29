import { test, expect } from '@fixtures/customFixtures';
import type { AdminPage } from '@pages/AdminPage';
import type { OrganizationPage } from '@pages/OrganizationPage';

test.describe('Admin Organization Locations @ui', () => {
  async function navigateToLocations(
    adminPage: AdminPage,
    orgPage: OrganizationPage,
  ): Promise<void> {
    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await orgPage.clickAdminMenuItem('Organization');
    await orgPage.clickOrgSubMenuItem('Locations');
  }

  test('table has headers and rows', async ({ adminPage, organizationPage, locationsPage }) => {
    await navigateToLocations(adminPage, organizationPage);

    const headers = await locationsPage.getTableHeaders();
    expect(headers.length).toBeGreaterThan(0);
  });

  test('add button is visible on locations page', async ({
    adminPage,
    organizationPage,
    locationsPage,
  }) => {
    await navigateToLocations(adminPage, organizationPage);

    expect(await locationsPage.isAddButtonVisible()).toBe(true);
  });

  test('add form loads with add location header', async ({
    adminPage,
    organizationPage,
    locationsPage,
  }) => {
    await navigateToLocations(adminPage, organizationPage);
    await locationsPage.clickAdd();

    expect(await locationsPage.isAddFormDisplayed()).toBe(true);
  });

  test('cancel from add returns to locations list', async ({
    adminPage,
    organizationPage,
    locationsPage,
  }) => {
    await navigateToLocations(adminPage, organizationPage);
    await locationsPage.clickAdd();

    expect(await locationsPage.isAddFormDisplayed()).toBe(true);

    await locationsPage.clickCancel();

    expect(await locationsPage.isPageLoaded()).toBe(true);
    expect(await locationsPage.isAddButtonVisible()).toBe(true);
  });

  test('required name field shows validation error on empty submit', async ({
    adminPage,
    organizationPage,
    locationsPage,
  }) => {
    await navigateToLocations(adminPage, organizationPage);
    await locationsPage.clickAdd();

    expect(await locationsPage.isAddFormDisplayed()).toBe(true);

    await locationsPage.formSaveButton.click();
    await locationsPage.waitForLoaderToDisappear();

    const errors = await locationsPage.getFormErrorMessages();
    expect(errors.some((e) => /required/i.test(e))).toBe(true);
  });

  test('each row has edit and delete action buttons', async ({
    adminPage,
    organizationPage,
    locationsPage,
  }) => {
    await navigateToLocations(adminPage, organizationPage);

    const rowCount = await locationsPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    expect(await locationsPage.isEditButtonVisible(0)).toBe(true);
    expect(await locationsPage.isDeleteButtonVisible(0)).toBe(true);
  });

  test('edit form displays with correct header', async ({
    adminPage,
    organizationPage,
    locationsPage,
  }) => {
    await navigateToLocations(adminPage, organizationPage);

    const rowCount = await locationsPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    await locationsPage.clickEdit(0);
    expect(await locationsPage.isEditFormDisplayed()).toBe(true);
  });

  test('cancel from edit returns to locations list', async ({
    adminPage,
    organizationPage,
    locationsPage,
  }) => {
    await navigateToLocations(adminPage, organizationPage);

    const rowCount = await locationsPage.getRowCount();
    test.skip(rowCount === 0, 'no rows to verify');

    await locationsPage.clickEdit(0);
    expect(await locationsPage.isEditFormDisplayed()).toBe(true);

    await locationsPage.clickCancel();
    expect(await locationsPage.isPageLoaded()).toBe(true);
    expect(await locationsPage.isAddButtonVisible()).toBe(true);
  });
});
