import { test, expect } from '@fixtures/customFixtures';
import { TIMEOUTS } from '@data/constants';

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
    await loginPage.submitForgotPassword('thisuserdoesnotexist');
    await loginPage.waitForPageLoad();

    await expect(loginPage.page.locator('.oxd-alert-content-text')).toBeVisible();
  });

  test('valid username never finishes loading', async ({ loginPage }) => {
    await loginPage.clickForgotPassword();
    await loginPage.submitForgotPasswordWithoutWait('Admin');

    await expect(loginPage.resetSuccessMessage).toBeVisible({ timeout: TIMEOUTS.SHORT });
  });
});
