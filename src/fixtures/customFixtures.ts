import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { PimPage } from '@pages/PimPage';
import { AdminPage } from '@pages/AdminPage';
import { ApiHelper } from '@utils/apiHelper';
import { Environment } from '@config/environment';
import logger from '@utils/logger';

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PimPage;
  adminPage: AdminPage;
};

type Api = {
  apiHelper: ApiHelper;
};

type AuthFixtures = {
  authenticatedPage: LoginPage;
};

export const test = base.extend<Pages & Api & AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  pimPage: async ({ page }, use) => {
    const pimPage = new PimPage(page);
    await use(pimPage);
  },

  adminPage: async ({ page }, use) => {
    const adminPage = new AdminPage(page);
    await use(adminPage);
  },

  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
  },

  authenticatedPage: async ({ loginPage }, use) => {
    const { username, password } = Environment.adminCredentials;
    await loginPage.navigate();
    await loginPage.login(username, password);

    logger.info('Authenticated fixture setup complete');
    await use(loginPage);
  },
});

export { expect };
