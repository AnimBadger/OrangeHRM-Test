import { test, expect } from '@fixtures/customFixtures';
import { MESSAGES } from '@data/constants';

test.describe('Login - Smoke Tests', () => {
  test('should display login page with all required elements @smoke', async ({ loginPage }) => {
    await loginPage.navigate();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.orangeHrmLogo).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test('should login with valid admin credentials @smoke', async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    await loginPage.login('Admin', 'admin123');

    const isDashboardVisible = await dashboardPage.isDashboardDisplayed();
    expect(isDashboardVisible).toBe(true);
    await dashboardPage.verifyUrl(/dashboard/);
  });

  test('should show error for invalid credentials @smoke', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('wrongUser', 'wrongPass');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain(MESSAGES.invalidCredentials);
  });

  test('should logout successfully @smoke', async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    await loginPage.login('Admin', 'admin123');
    await dashboardPage.logout();

    const isLoginPage = await loginPage.isLoginPageDisplayed();
    expect(isLoginPage).toBe(true);
  });
});
