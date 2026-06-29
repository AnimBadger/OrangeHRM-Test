import { test, expect } from '@fixtures/customFixtures';
import type { AdminPage } from '@pages/AdminPage';
import type { OrganizationPage } from '@pages/OrganizationPage';

test.describe('Admin Organization General Information @ui', () => {
  async function navigateToGeneralInfo(
    adminPage: AdminPage,
    orgPage: OrganizationPage,
  ): Promise<void> {
    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await orgPage.clickAdminMenuItem('Organization');
    await orgPage.clickOrgSubMenuItem('General Information');
  }

  test('page loads with correct header', async ({
    adminPage,
    organizationPage,
    generalInfoPage,
  }) => {
    await navigateToGeneralInfo(adminPage, organizationPage);

    expect(await generalInfoPage.isPageLoaded()).toBe(true);
  });

  test('organization name input is pre-populated', async ({
    adminPage,
    organizationPage,
    generalInfoPage,
  }) => {
    await navigateToGeneralInfo(adminPage, organizationPage);

    const value = await generalInfoPage.getOrganizationNameValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('save button is visible', async ({ adminPage, organizationPage, generalInfoPage }) => {
    await navigateToGeneralInfo(adminPage, organizationPage);

    await expect(generalInfoPage.formSaveButton).toBeVisible();
  });
});
