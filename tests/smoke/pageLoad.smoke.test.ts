import { test, expect } from '@fixtures/customFixtures';

test.describe('Page Load @smoke', () => {
  test('should display the login page with login button visible', async ({ loginPage }) => {
    await loginPage.navigate();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
