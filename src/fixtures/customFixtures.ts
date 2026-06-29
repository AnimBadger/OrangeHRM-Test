import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { PimPage } from '@pages/PimPage';
import { AdminPage } from '@pages/AdminPage';
import { JobsPage } from '@pages/JobsPage';
import { PayGradesPage } from '@pages/PayGradesPage';
import { EmploymentStatusPage } from '@pages/EmploymentStatusPage';
import { JobCategoriesPage } from '@pages/JobCategoriesPage';
import { WorkShiftsPage } from '@pages/WorkShiftsPage';
import { OrganizationPage } from '@pages/OrganizationPage';
import { LocationsPage } from '@pages/LocationsPage';
import { GeneralInfoPage } from '@pages/GeneralInfoPage';
import { StructurePage } from '@pages/StructurePage';
import { QualificationsPage } from '@pages/QualificationsPage';
import { SkillsPage } from '@pages/SkillsPage';
import { ApiHelper } from '@utils/apiHelper';
import { Environment } from '@config/environment';
import logger from '@utils/logger';

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PimPage;
  adminPage: AdminPage;
  jobsPage: JobsPage;
  payGradesPage: PayGradesPage;
  employmentStatusPage: EmploymentStatusPage;
  jobCategoriesPage: JobCategoriesPage;
  workShiftsPage: WorkShiftsPage;
  organizationPage: OrganizationPage;
  locationsPage: LocationsPage;
  generalInfoPage: GeneralInfoPage;
  structurePage: StructurePage;
  qualificationsPage: QualificationsPage;
  skillsPage: SkillsPage;
};

type Api = {
  apiHelper: ApiHelper;
  authenticatedApiHelper: ApiHelper;
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

  jobsPage: async ({ page }, use) => {
    const jobsPage = new JobsPage(page);
    await use(jobsPage);
  },

  payGradesPage: async ({ page }, use) => {
    const payGradesPage = new PayGradesPage(page);
    await use(payGradesPage);
  },

  employmentStatusPage: async ({ page }, use) => {
    const employmentStatusPage = new EmploymentStatusPage(page);
    await use(employmentStatusPage);
  },

  jobCategoriesPage: async ({ page }, use) => {
    const jobCategoriesPage = new JobCategoriesPage(page);
    await use(jobCategoriesPage);
  },

  workShiftsPage: async ({ page }, use) => {
    const workShiftsPage = new WorkShiftsPage(page);
    await use(workShiftsPage);
  },

  organizationPage: async ({ page }, use) => {
    const organizationPage = new OrganizationPage(page);
    await use(organizationPage);
  },

  locationsPage: async ({ page }, use) => {
    const locationsPage = new LocationsPage(page);
    await use(locationsPage);
  },

  generalInfoPage: async ({ page }, use) => {
    const generalInfoPage = new GeneralInfoPage(page);
    await use(generalInfoPage);
  },

  structurePage: async ({ page }, use) => {
    const structurePage = new StructurePage(page);
    await use(structurePage);
  },

  qualificationsPage: async ({ page }, use) => {
    const qualificationsPage = new QualificationsPage(page);
    await use(qualificationsPage);
  },

  skillsPage: async ({ page }, use) => {
    const skillsPage = new SkillsPage(page);
    await use(skillsPage);
  },

  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
  },

  authenticatedApiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    const { username, password } = Environment.adminCredentials;
    const loginRes = await apiHelper.loginAndFollowRedirect(username, password);
    if (!loginRes.ok()) {
      throw new Error(`API auth setup failed: ${loginRes.status()} ${loginRes.url()}`);
    }
    logger.info('Authenticated API helper fixture ready');
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
