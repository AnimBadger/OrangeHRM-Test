import { test, expect } from '@fixtures/customFixtures';
import { validCredentials, invalidCredentials } from '@data/users';
import { buzzFeedResponse } from '@data/mockData';

const buzzUrl =
  '**/web/index.php/api/v2/buzz/feed?limit=5&offset=0&sortOrder=DESC&sortField=share.createdAtUtc';

test.describe('Login API @api', () => {
  test('valid login and buzz feed renders on dashboard', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await page.route(buzzUrl, async (route) => {
      await route.fulfill({ json: buzzFeedResponse });
    });

    await loginPage.navigate();
    await loginPage.login(validCredentials.username, validCredentials.password);

    await expect(dashboardPage.buzzWidget).toBeVisible();
    const postCount = await dashboardPage.getBuzzPostCount();
    expect(postCount).toBe(buzzFeedResponse.data.length);

    const firstPostText = await dashboardPage.getBuzzPostText(0);
    expect(firstPostText).toContain('Lenard');
    expect(firstPostText).toContain('Ferrari');
  });

  test('invalid credentials should be rejected by server', async ({ apiHelper }) => {
    const response = await apiHelper.loginSubmit(
      invalidCredentials.username,
      invalidCredentials.password,
    );

    expect(response.ok()).not.toBeTruthy();
  });
});
