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
});
