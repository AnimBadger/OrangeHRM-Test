import { test as setup, expect } from '@playwright/test';
import { Environment } from '@config/environment';

const authFile = '.auth/user.json';

setup('authenticate and save storage state', async ({ page }) => {
  const { username, password } = Environment.adminCredentials;
  const usernameInput = page.locator('input[name="username"]');
  const passwordInput = page.locator('input[name="password"]');
  const loginButton = page.locator('button[type="submit"]');

  await page.goto('/web/index.php/auth/login');
  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await loginButton.click();
  await expect(page.locator('.oxd-topbar-header-title')).toBeVisible();
  await page.context().storageState({ path: authFile });
});
