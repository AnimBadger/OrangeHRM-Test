import { test, expect } from '@fixtures/customFixtures';

test.describe('Forgot Password @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('cancel returns to login page', async ({ loginPage }) => {
    await loginPage.clickForgotPassword();
    expect(await loginPage.isForgotPasswordPage()).toBe(true);

    await loginPage.clickCancel();
    expect(await loginPage.isLoginPageDisplayed()).toBe(true);
  });

  test('non-existent username shows success instead of error', async ({ loginPage }) => {
    await loginPage.clickForgotPassword();
    await loginPage.page
      .locator('.orangehrm-forgot-password-container input[name="username"]')
      .waitFor({ state: 'visible', timeout: 20000 });
    await loginPage.resetUsernameInput.fill('thisuserdoesnotexist');
    await loginPage.page.locator('button[type="submit"]').click({ noWaitAfter: true });

    await expect(loginPage.resetSuccessHeading).toBeVisible({ timeout: 20000 });
  });
});
