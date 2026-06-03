import { defineConfig, devices } from '@playwright/test';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

dotenvConfig({ path: path.resolve(__dirname, 'env/.env') });

const browserConfig = {
  ...devices['Desktop Firefox'],
  viewport: { width: 1920, height: 1080 },
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['list'],
  ],

  timeout: 60000,

  use: {
    baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'login',
      testMatch: ['ui/login/**'],
      use: browserConfig,
    },
    {
      name: 'dashboard',
      testMatch: ['ui/dashboard/**'],
      use: browserConfig,
    },
    {
      name: 'admin',
      testMatch: ['ui/admin/**'],
      use: browserConfig,
    },
    {
      name: 'smoke',
      testMatch: ['**/smoke/*'],
      use: browserConfig,
    },
    {
      name: 'api',
      testMatch: ['api/**'],
      use: browserConfig,
    },
  ],
});
