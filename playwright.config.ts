import { defineConfig, devices } from '@playwright/test';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

dotenvConfig({ path: path.resolve(__dirname, 'env/.env') });

const isCi = !!process.env.CI;

const browserConfig = {
  ...devices['Desktop Firefox'],
  viewport: { width: 1920, height: 1080 },
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  workers: process.env.CI ? 4 : 2,

  reporter: isCi
    ? [
        ['html', { outputFolder: 'playwright-report' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['list'],
      ]
    : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],

  timeout: 60000,

  use: {
    baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    trace: isCi ? 'on-first-retry' : 'off',
    screenshot: isCi ? 'only-on-failure' : 'off',
    video: isCi ? 'retain-on-failure' : 'off',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'setup',
      testMatch: ['auth/global.setup.ts'],
      use: browserConfig,
    },
    {
      name: 'login',
      testMatch: ['ui/login/**'],
      dependencies: ['setup'],
      use: browserConfig,
    },
    {
      name: 'dashboard',
      testMatch: ['ui/dashboard/**'],
      dependencies: ['setup'],
      use: {
        ...browserConfig,
        storageState: '.auth/user.json',
      },
    },
    {
      name: 'admin',
      testMatch: ['ui/admin/**'],
      dependencies: ['setup'],
      use: {
        ...browserConfig,
        storageState: '.auth/user.json',
      },
    },
    {
      name: 'smoke',
      testMatch: ['**/smoke/*'],
      dependencies: ['login'],
      use: browserConfig,
    },
  ],
});
