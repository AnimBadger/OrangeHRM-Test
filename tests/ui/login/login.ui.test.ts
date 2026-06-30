import { test, expect } from '@fixtures/customFixtures';
import { MESSAGES } from '@data/constants';
import { validCredentials, invalidCredentials } from '@data/users';

test.describe('Login @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('valid admin credentials redirect to dashboard with buzz feed', async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login(validCredentials.username, validCredentials.password);

    await expect(dashboardPage.dashboardHeader).toBeVisible();
    await dashboardPage.verifyUrl(/dashboard/);
    await expect(dashboardPage.buzzWidget).toBeVisible();

    const postCount = await dashboardPage.getBuzzPostCount();
    expect(postCount).toBeGreaterThan(0);
  });

  test('invalid credentials show error message', async ({ loginPage }) => {
    await loginPage.login(invalidCredentials.username, invalidCredentials.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toBe(MESSAGES.invalidCredentials);
  });

  test.describe('input validation @ui', () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.navigate();
    });

    test('submitting without username shows field error', async ({ loginPage }) => {
      await loginPage.fill(loginPage.passwordInput, 'somePassword123');
      await loginPage.click(loginPage.loginButton);

      const errors = await loginPage.getRequiredFieldErrors();
      expect(errors.length).toBeGreaterThan(0);
    });

    test('submitting without password shows field error', async ({ loginPage }) => {
      await loginPage.fill(loginPage.usernameInput, 'Admin');
      await loginPage.click(loginPage.loginButton);

      const errors = await loginPage.getRequiredFieldErrors();
      expect(errors.length).toBeGreaterThan(0);
    });

    test('single char username should show minimum length validation', async ({ loginPage }) => {
      await loginPage.fill(loginPage.usernameInput, 'a');
      await loginPage.fill(loginPage.passwordInput, 'Admin123');
      await loginPage.click(loginPage.loginButton);
      await loginPage.waitForLoaderToDisappear();

      const errors = await loginPage.getRequiredFieldErrors();
      expect(errors.some((e) => /at least|minimum|should have/i.test(e))).toBe(true);
    });

    test('single char password should show minimum length validation', async ({ loginPage }) => {
      await loginPage.fill(loginPage.usernameInput, 'Admin');
      await loginPage.fill(loginPage.passwordInput, 'a');
      await loginPage.click(loginPage.loginButton);
      await loginPage.waitForLoaderToDisappear();

      const errors = await loginPage.getRequiredFieldErrors();
      expect(errors.some((e) => /at least|minimum|should have/i.test(e))).toBe(true);
    });
  });
});
