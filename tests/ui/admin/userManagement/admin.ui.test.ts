import { test, expect } from '@fixtures/customFixtures';
import { validCredentials } from '@data/users';
import { DataGenerator } from '@utils/dataGenerator';
import type { CreateUserRequest } from '@typedefs/index';
import type { AdminPage } from '@pages/AdminPage';

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

test.describe('Admin Search Filters @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(validCredentials.username, validCredentials.password);
  });

  test('search by username and role returns matching results', async ({ adminPage }) => {
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

  test('search by status only filters results', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    await adminPage.selectStatus('Enabled');
    await adminPage.clickSearch();

    const rowCount = await adminPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('search by user role only filters results', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    await adminPage.selectUserRole('ESS');
    await adminPage.clickSearch();

    const rowCount = await adminPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('non-existent username shows no records', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    await adminPage.searchByUsername(`zzz_${DataGenerator.generateRandomString(10)}`);
    await adminPage.clickSearch();

    const rowCount = await adminPage.getRowCount();
    expect(rowCount).toBe(0);
  });

  test('empty search returns all records', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    await adminPage.clickSearch();

    const rowCount = await adminPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('search with all filters combined returns results', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    await adminPage.searchByUsername('Admin');
    await adminPage.selectUserRole('Admin');
    await adminPage.selectStatus('Enabled');
    await adminPage.clickSearch();

    const rowCount = await adminPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);

    const cellText = await adminPage.getCellText(0, 1);
    expect(cellText.toLowerCase()).toContain('admin');
  });

  test('reset restores all records after filtered search', async ({ adminPage }) => {
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
});

test.describe('Admin Edit and Delete @ui', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(validCredentials.username, validCredentials.password);
  });

  test('each row has edit and delete action buttons', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    const rowCount = await adminPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);

    expect(await adminPage.isEditButtonVisible(0)).toBe(true);
    expect(await adminPage.isDeleteButtonVisible(0)).toBe(true);
  });

  test('edit form loads with user data', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    const username = await adminPage.getCellText(0, 1);
    const userRole = await adminPage.getCellText(0, 2);

    await adminPage.clickEditUser(0);
    expect(await adminPage.isEditUserFormDisplayed()).toBe(true);

    await adminPage.clickFormCancel();
    await adminPage.loadSystemUsers();

    const rowIndex = await adminPage.findUserInTableByUsername(username);
    expect(rowIndex).toBeGreaterThanOrEqual(0);
    expect(await adminPage.getCellText(rowIndex, 2)).toBe(userRole);
  });

  test('edit form fields are pre-populated', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    const username = await adminPage.getCellText(0, 1);

    await adminPage.clickEditUser(0);
    expect(await adminPage.isEditUserFormDisplayed()).toBe(true);

    const inputValue = await adminPage.formUsernameInput.inputValue();
    expect(inputValue.toLowerCase()).toBe(username.toLowerCase());

    await adminPage.clickFormCancel();
    expect(await adminPage.isAdminPageLoaded()).toBe(true);
  });

  test('cancel from edit form returns to user list', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();

    await adminPage.clickEditUser(0);
    expect(await adminPage.isEditUserFormDisplayed()).toBe(true);

    await adminPage.clickFormCancel();
    expect(await adminPage.isAdminPageLoaded()).toBe(true);
    expect(await adminPage.getRowCount()).toBeGreaterThan(0);
  });
});

test.describe('Admin Edit User - Save Changes @ui', () => {
  let testUserId: number;
  let testUsername: string;
  let testEmpNumber: number;

  test.beforeAll(async ({ authenticatedApiHelper }) => {
    const listRes = await authenticatedApiHelper.getUsers();
    const listBody = await listRes.json();
    testEmpNumber = listBody.data[0].employee.empNumber;

    testUsername = `uiedit_${DataGenerator.generateRandomString(6).toLowerCase()}`;
    const createData: CreateUserRequest = {
      username: testUsername,
      password: `Test${DataGenerator.generateRandomString(4)}1!`,
      status: true,
      userRoleId: 1,
      empNumber: testEmpNumber,
    };
    const createRes = await authenticatedApiHelper.createUser(createData);
    const createBody = await createRes.json();
    testUserId = createBody.data.id;
  });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(validCredentials.username, validCredentials.password);
  });

  test.afterAll(async ({ authenticatedApiHelper }) => {
    if (testUserId) {
      await authenticatedApiHelper.deleteUsers([testUserId]);
    }
  });

  async function findAndEditUser(adminPage: AdminPage, username: string): Promise<number> {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.searchByUsername(username);
    await adminPage.clickSearch();
    const rowIndex = await adminPage.findUserInTableByUsername(username);
    expect(rowIndex).toBeGreaterThanOrEqual(0);
    await adminPage.clickEditUser(rowIndex);
    expect(await adminPage.isEditUserFormDisplayed()).toBe(true);
    return rowIndex;
  }

  test('saves status change from enabled to disabled', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.searchByUsername(testUsername);
    await adminPage.clickSearch();

    const rowBefore = await adminPage.findUserInTableByUsername(testUsername);
    expect(rowBefore).toBeGreaterThanOrEqual(0);

    const statusBefore = await adminPage.getCellText(rowBefore, 4);
    expect(statusBefore.toLowerCase()).toBe('enabled');

    await adminPage.clickEditUser(rowBefore);
    expect(await adminPage.isEditUserFormDisplayed()).toBe(true);

    await adminPage.selectFormStatus('Disabled');
    await adminPage.clickFormSave();

    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.searchByUsername(testUsername);
    await adminPage.clickSearch();

    const row = await adminPage.findUserInTableByUsername(testUsername);
    expect(row).toBeGreaterThanOrEqual(0);
    const statusText = await adminPage.getCellText(row, 4);
    expect(statusText.toLowerCase()).toBe('disabled');
  });

  test('saves role change from admin to ess', async ({ adminPage }) => {
    await findAndEditUser(adminPage, testUsername);

    await adminPage.selectFormUserRole('ESS');
    await adminPage.clickFormSave();
    await adminPage.waitForLoaderToDisappear();

    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.searchByUsername(testUsername);
    await adminPage.clickSearch();

    const row = await adminPage.findUserInTableByUsername(testUsername);
    expect(row).toBeGreaterThanOrEqual(0);
    const roleText = await adminPage.getCellText(row, 2);
    expect(roleText.toLowerCase()).toBe('ess');
  });

  test('shows validation error when saving with empty username', async ({ adminPage }) => {
    await findAndEditUser(adminPage, testUsername);

    await adminPage.fillFormUsername('');
    await adminPage.clickFormSave();

    const errors = await adminPage.getFormErrorMessages();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.toLowerCase().includes('required'))).toBe(true);
  });

  test('shows error when saving with existing username', async ({ adminPage, page }) => {
    await findAndEditUser(adminPage, testUsername);

    await adminPage.fillFormUsername('Admin');
    await adminPage.clickFormSave();

    const errors = await adminPage.getFormErrorMessages();
    const allFieldText = errors.join(' ').toLowerCase();
    const toastText =
      (await page
        .locator('.oxd-toast, .oxd-text--span')
        .first()
        .textContent({ timeout: 5000 })
        .catch(() => '')) || '';

    const hasError =
      allFieldText.includes('exists') ||
      allFieldText.includes('already') ||
      toastText.toLowerCase().includes('exists');
    expect(hasError).toBe(true);
  });
});
