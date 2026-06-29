import { test, expect } from '@fixtures/customFixtures';

test.describe('Sidebar Search @ui', () => {
  test('search input is visible', async ({ dashboardPage }) => {
    await expect(dashboardPage.searchInput).toBeVisible();
  });

  test('searching for an existing item filters to show only matching items', async ({
    dashboardPage,
  }) => {
    await dashboardPage.searchMenu('Admin');
    const visible = await dashboardPage.getVisibleSidebarMenuTexts();
    expect(visible).toEqual(['Admin']);
  });

  test('searching for non-existent text shows no results', async ({ dashboardPage }) => {
    await dashboardPage.searchMenu('zzz');
    const visible = await dashboardPage.getVisibleSidebarMenuTexts();
    expect(visible).toEqual([]);
  });

  test('clearing search restores all menu items', async ({ dashboardPage }) => {
    await dashboardPage.searchMenu('Leave');
    await dashboardPage.clearSearch();

    const visible = await dashboardPage.getVisibleSidebarMenuTexts();
    const expected = Object.keys(dashboardPage.getSidebarMenuRoutes());
    expect(visible).toEqual(expected);
  });

  test('search is case insensitive', async ({ dashboardPage }) => {
    await dashboardPage.searchMenu('admin');
    let visible = await dashboardPage.getVisibleSidebarMenuTexts();
    expect(visible).toEqual(['Admin']);

    await dashboardPage.clearSearch();
    await dashboardPage.searchMenu('ADMIN');
    visible = await dashboardPage.getVisibleSidebarMenuTexts();
    expect(visible).toEqual(['Admin']);

    await dashboardPage.clearSearch();
    await dashboardPage.searchMenu('aDmIn');
    visible = await dashboardPage.getVisibleSidebarMenuTexts();
    expect(visible).toEqual(['Admin']);
  });
});
