import { test, expect } from '@fixtures/customFixtures';
import { validCredentials } from '@data/users';

test.describe('Admin Page @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(validCredentials.username, validCredentials.password);
  });

  test('page loads with correct header and breadcrumb', async ({ adminPage }) => {
    await adminPage.navigate();
    const loaded = await adminPage.isAdminPageLoaded();
    expect(loaded).toBe(true);

    const headerText = await adminPage.getAdminHeaderText();
    expect(headerText).toBe('Admin');
  });

  test('top bar menu items are displayed', async ({ adminPage }) => {
    await adminPage.navigate();
    const menuTexts = await adminPage.getAdminMenuTexts();
    expect(menuTexts.length).toBeGreaterThanOrEqual(6);
    expect(menuTexts).toContain('User Management');
    expect(menuTexts).toContain('Job');
    expect(menuTexts).toContain('Organization');
  });

  test('system users search form is functional', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    await adminPage.searchByUsername('Admin');
    await adminPage.selectUserRole('Admin');
    await adminPage.clickSearch();

    const rowCount = await adminPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);

    const cellText = await adminPage.getCellText(0, 1);
    expect(cellText.toLowerCase()).toContain('admin');
  });

  test('reset button clears search filters', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    await adminPage.searchByUsername('NonExistentUser');
    await adminPage.selectStatus('Disabled');
    await adminPage.clickSearch();

    await adminPage.clickReset();

    const rowCount = await adminPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('add user button is visible', async ({ adminPage }) => {
    await adminPage.navigate();
    const isVisible = await adminPage.isAddUserButtonVisible();
    expect(isVisible).toBe(true);
  });

  test('table displays expected columns', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    const headers = await adminPage.getTableHeaders();
    const expectedColumns = ['Username', 'User Role', 'Employee Name', 'Status'];
    for (const col of expectedColumns) {
      expect(headers).toContain(col);
    }
  });

  test('records found text is displayed after search', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    const recordsText = await adminPage.getRecordsFoundText();
    expect(recordsText).toMatch(/\(\d+\)\s*Record(s)? Found/);
  });
});
