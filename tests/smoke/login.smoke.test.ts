import { test, expect } from '@fixtures/customFixtures';
import { MESSAGES } from '@data/constants';
import { validCredentials, invalidCredentials, wrongUsername, wrongPassword } from '@data/users';

test.describe('Login @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('valid admin credentials redirect to dashboard', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(validCredentials.username, validCredentials.password);

    await expect(dashboardPage.dashboardHeader).toBeVisible();
    await dashboardPage.verifyUrl(/dashboard/);
  });

  test('invalid credentials show error message', async ({ loginPage }) => {
    await loginPage.login(invalidCredentials.username, invalidCredentials.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toBe(MESSAGES.invalidCredentials);
  });

  test('wrong username shows error message', async ({ loginPage }) => {
    await loginPage.login(wrongUsername.username, wrongUsername.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toBe(MESSAGES.invalidCredentials);
  });

  test('wrong password shows error message', async ({ loginPage }) => {
    await loginPage.login(wrongPassword.username, wrongPassword.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toBe(MESSAGES.invalidCredentials);
  });

  test('empty username shows required field validation', async ({ loginPage }) => {
    await loginPage.passwordInput.fill(validCredentials.password);
    await loginPage.loginButton.click();

    await expect(loginPage.requiredFieldErrors).toContainText(MESSAGES.requiredField);
  });

  test('empty password shows required field validation', async ({ loginPage }) => {
    await loginPage.usernameInput.fill(validCredentials.username);
    await loginPage.loginButton.click();

    await expect(loginPage.requiredFieldErrors).toContainText(MESSAGES.requiredField);
  });
});
