import { test, expect } from '@fixtures/customFixtures';
import { validCredentials, invalidCredentials } from '@data/users';

test.describe('Login API @api', () => {
  test('valid credentials reach the server', async ({ apiHelper }) => {
    const response = await apiHelper.loginSubmit(
      validCredentials.username,
      validCredentials.password,
    );

    expect(response.ok()).toBeTruthy();
  });

  test('invalid credentials should be rejected by server', async ({ apiHelper }) => {
    const response = await apiHelper.loginSubmit(
      invalidCredentials.username,
      invalidCredentials.password,
    );

    expect(response.ok()).not.toBeTruthy();
  });
});
