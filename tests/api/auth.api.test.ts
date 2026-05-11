import { test, expect } from '@fixtures/customFixtures';

test.describe('Authentication API Tests @api', () => {
  test('should authenticate with valid credentials', async ({ apiHelper }) => {
    const token = await apiHelper.login('Admin', 'admin123');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  test('should reject invalid credentials', async ({ apiHelper }) => {
    const response = await apiHelper.post('/auth/login', {
      username: 'wrongUser',
      password: 'wrongPass',
    });

    expect(response.status()).toBe(401);
  });
});
