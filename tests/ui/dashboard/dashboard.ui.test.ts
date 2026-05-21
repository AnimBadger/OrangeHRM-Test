import { test, expect } from '@fixtures/customFixtures';
import { validCredentials } from '@data/users';
import { ROUTES } from '@data/constants';

test.describe('Dashboard Profile @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(validCredentials.username, validCredentials.password);
  });

  test('profile image is displayed in the header', async ({ dashboardPage }) => {
    const isVisible = await dashboardPage.isProfileImageVisible();
    expect(isVisible).toBe(true);

    const src = await dashboardPage.getProfileImageSrc();
    expect(src).toBeTruthy();
    expect(src).toContain('pim/viewPhoto');
  });

  test('profile name is displayed', async ({ dashboardPage }) => {
    const name = await dashboardPage.getProfileName();
    expect(name).toBeTruthy();
    expect(name.length).toBeGreaterThan(0);
  });

  test('user dropdown opens and shows all menu options', async ({ dashboardPage }) => {
    await dashboardPage.openUserDropdown();

    const isOpen = await dashboardPage.isDropdownMenuVisible();
    expect(isOpen).toBe(true);

    const options = await dashboardPage.getDropdownMenuOptions();
    expect(options).toContain('About');
    expect(options).toContain('Support');
    expect(options).toContain('Change Password');
    expect(options).toContain('Logout');
  });

  test('second click on dropdown should collapse it', async ({ dashboardPage }) => {
    await dashboardPage.openUserDropdown();
    expect(await dashboardPage.isDropdownMenuVisible()).toBe(true);

    await dashboardPage.openUserDropdown();
    expect(await dashboardPage.isDropdownMenuVisible()).toBe(false);
  });

  test('sidebar collapses on toggle and expands on second toggle', async ({ dashboardPage }) => {
    expect(await dashboardPage.isSidebarCollapsed()).toBe(false);

    await dashboardPage.toggleSidebar();
    expect(await dashboardPage.isSidebarCollapsed()).toBe(true);

    await dashboardPage.toggleSidebar();
    expect(await dashboardPage.isSidebarCollapsed()).toBe(false);
  });

  test('logout option works from dropdown', async ({ dashboardPage, loginPage }) => {
    await dashboardPage.openUserDropdown();
    await dashboardPage.logoutOption.click();

    await expect(loginPage.loginButton).toBeVisible();
  });
});

test.describe('User Dropdown Actions @ui', () => {
  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    await loginPage.login(validCredentials.username, validCredentials.password);
  });

  test('about modal displays company info', async ({ dashboardPage }) => {
    await dashboardPage.clickAbout();

    expect(await dashboardPage.isAboutModalVisible()).toBe(true);
    expect(await dashboardPage.getAboutModalTitle()).toBe('About');

    const info = await dashboardPage.getAboutInfo();
    const keys = Object.keys(info);
    const values = Object.values(info);
    expect(keys.some((k) => k.toLowerCase().includes('company'))).toBe(true);
    expect(keys.some((k) => k.toLowerCase().includes('version'))).toBe(true);
    expect(keys.some((k) => /employee/i.test(k))).toBe(true);
    expect(values.every((v) => v.length > 0)).toBe(true);
  });

  test('about modal closes', async ({ dashboardPage }) => {
    await dashboardPage.clickAbout();
    expect(await dashboardPage.isAboutModalVisible()).toBe(true);

    await dashboardPage.closeAboutModal();
    expect(await dashboardPage.isAboutModalVisible()).toBe(false);
  });

  test('support navigates to support page', async ({ dashboardPage }) => {
    await dashboardPage.clickSupport();

    await dashboardPage.verifyUrl(ROUTES.support);
  });

  test('change password navigates to update password page', async ({ dashboardPage }) => {
    await dashboardPage.clickChangePassword();

    await dashboardPage.verifyUrl(ROUTES.updatePassword);
  });

  test('profile name shows first and last name', async ({ dashboardPage }) => {
    const name = await dashboardPage.getProfileName();
    expect(name).toBeTruthy();
    expect(name.split(' ').length).toBeGreaterThanOrEqual(2);
  });
});
