import { test, expect } from '@fixtures/customFixtures';
import type { AdminPage } from '@pages/AdminPage';
import type { OrganizationPage } from '@pages/OrganizationPage';

test.describe('Admin Organization Structure @ui', () => {
  async function navigateToStructure(
    adminPage: AdminPage,
    orgPage: OrganizationPage,
  ): Promise<void> {
    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await orgPage.clickAdminMenuItem('Organization');
    await orgPage.clickOrgSubMenuItem('Structure');
  }

  test('page loads with correct header', async ({ adminPage, organizationPage, structurePage }) => {
    await navigateToStructure(adminPage, organizationPage);

    expect(await structurePage.isPageLoaded()).toBe(true);
  });

  test('add button is visible on structure page', async ({
    adminPage,
    organizationPage,
    structurePage,
  }) => {
    await navigateToStructure(adminPage, organizationPage);

    expect(await structurePage.isAddButtonVisible()).toBe(true);
  });
});
