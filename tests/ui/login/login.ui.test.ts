import { test, expect } from '@fixtures/customFixtures';
import { MESSAGES } from '@data/constants';
import { validCredentials, invalidCredentials } from '@data/users';
import { emptyFieldCases, shortInputCases } from '@data/loginValidationData';

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

    emptyFieldCases.forEach(({ description, username, password }) => {
      test(description, async ({ loginPage }) => {
        await loginPage.usernameInput.fill(username);
        await loginPage.passwordInput.fill(password);
        await loginPage.loginButton.click();

        const errors = await loginPage.getRequiredFieldErrors();
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    shortInputCases.forEach(({ description, username, password }) => {
      test(description, async ({ loginPage }) => {
        await loginPage.usernameInput.fill(username);
        await loginPage.passwordInput.fill(password);
        await loginPage.loginButton.click();
        await loginPage.waitForLoaderToDisappear();

        const errors = await loginPage.getRequiredFieldErrors();
        expect(errors.some((e) => /at least|minimum|should have/i.test(e))).toBe(true);
      });
    });
  });
});
