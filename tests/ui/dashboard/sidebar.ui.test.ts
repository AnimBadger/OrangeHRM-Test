import { test, expect } from '@fixtures/customFixtures';
import { validCredentials } from '@data/users';

test.describe('Dashboard Sidebar Branding @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(validCredentials.username, validCredentials.password);
  });

  test('sidebar header is visible', async ({ dashboardPage }) => {
    await expect(dashboardPage.sidebarHeader).toBeVisible();
  });

  test('brand logo is present with correct source', async ({ dashboardPage }) => {
    const src = await dashboardPage.getBrandLogoSrc();
    expect(src).toContain('orange.png');

    const alt = await dashboardPage.getBrandLogoAlt();
    expect(alt).toBe('client brand logo');
  });

  test('brand link points to OrangeHRM website', async ({ dashboardPage }) => {
    const href = await dashboardPage.getBrandLinkHref();
    expect(href).toContain('orangehrm.com');
  });
});

test.describe('Dashboard Sidebar @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(validCredentials.username, validCredentials.password);
  });

  test('all sidebar menu items are displayed with correct labels', async ({ dashboardPage }) => {
    const texts = await dashboardPage.getSidebarMenuTexts();
    const expected = Object.keys(dashboardPage.getSidebarMenuRoutes());
    expect(texts).toEqual(expected);
  });

  test('clicking each sidebar item navigates to the module page', async ({ dashboardPage }) => {
    const routes = dashboardPage.getSidebarMenuRoutes();
    for (const name of Object.keys(routes)) {
      const href = await dashboardPage.getSidebarMenuItemHref(name);
      const module = href.split('/')[3];
      const modulePath = '/' + module + '/';

      await dashboardPage.clickSidebarMenuItem(name);
      await dashboardPage.waitForPageLoad();

      expect
        .soft(dashboardPage.page.url(), `"${name}" should navigate to ${modulePath}`)
        .toContain(modulePath);

      await dashboardPage.navigate();
      await dashboardPage.waitForPageLoad();
    }
  });
});
