import { test, expect } from '@fixtures/customFixtures';
import { DataGenerator } from '@utils/dataGenerator';

type AdminPage = {
  navigate(): Promise<void>;
  loadSystemUsers(): Promise<void>;
  getRowCount(): Promise<number>;
  getCellText(row: number, column: number): Promise<string>;
};

test.describe('Admin Add User @ui', () => {
  async function getFirstEmployeeName(adminPage: AdminPage): Promise<string> {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    const rowCount = await adminPage.getRowCount();
    if (rowCount === 0) return '';
    return await adminPage.getCellText(0, 3);
  }

  test('adds a new admin user and appears in the table', async ({ adminPage }) => {
    const employeeName = await getFirstEmployeeName(adminPage);
    const username = DataGenerator.generateRandomString(8);
    const password = DataGenerator.generatePassword(10);

    await adminPage.clickAddUser();
    expect(await adminPage.isAddUserFormDisplayed()).toBe(true);

    await adminPage.addSystemUser(
      { userRole: 'Admin', employeeName, status: 'Enabled', username, password },
      employeeName,
    );

    const successMsg = await adminPage.getSuccessMessage();
    expect(successMsg).toBeTruthy();

    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.searchByUsername(username);
    await adminPage.selectUserRole('Admin');
    await adminPage.clickSearch();

    const rowIndex = await adminPage.findUserInTableByUsername(username);
    expect(rowIndex).toBeGreaterThanOrEqual(0);
    expect(await adminPage.getCellText(rowIndex, 2)).toBe('Admin');
    expect(await adminPage.getCellText(rowIndex, 4)).toBe('Enabled');
  });

  test('adds a new ESS user', async ({ adminPage }) => {
    const employeeName = await getFirstEmployeeName(adminPage);
    const username = `ess_${DataGenerator.generateRandomString(6)}`;
    const password = DataGenerator.generatePassword(10);

    await adminPage.clickAddUser();
    expect(await adminPage.isAddUserFormDisplayed()).toBe(true);

    await adminPage.addSystemUser(
      { userRole: 'ESS', employeeName, status: 'Enabled', username, password },
      employeeName,
    );

    const successMsg = await adminPage.getSuccessMessage();
    expect(successMsg).toBeTruthy();

    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.searchByUsername(username);
    await adminPage.clickSearch();

    const rowIndex = await adminPage.findUserInTableByUsername(username);
    expect(rowIndex).toBeGreaterThanOrEqual(0);
    expect(await adminPage.getCellText(rowIndex, 2)).toBe('ESS');
  });

  test('adds a disabled user', async ({ adminPage }) => {
    const employeeName = await getFirstEmployeeName(adminPage);
    const username = `disabled_${DataGenerator.generateRandomString(6)}`;
    const password = DataGenerator.generatePassword(10);

    await adminPage.clickAddUser();
    expect(await adminPage.isAddUserFormDisplayed()).toBe(true);

    await adminPage.addSystemUser(
      { userRole: 'Admin', employeeName, status: 'Disabled', username, password },
      employeeName,
    );

    const successMsg = await adminPage.getSuccessMessage();
    expect(successMsg).toBeTruthy();

    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.searchByUsername(username);
    await adminPage.selectStatus('Disabled');
    await adminPage.clickSearch();

    const rowIndex = await adminPage.findUserInTableByUsername(username);
    expect(rowIndex).toBeGreaterThanOrEqual(0);
    expect(await adminPage.getCellText(rowIndex, 4)).toBe('Disabled');
  });

  test('duplicate username shows error', async ({ adminPage }) => {
    const employeeName = await getFirstEmployeeName(adminPage);
    const username = `dup_${DataGenerator.generateRandomString(6)}`;
    const password = DataGenerator.generatePassword(10);

    await adminPage.clickAddUser();
    expect(await adminPage.isAddUserFormDisplayed()).toBe(true);

    await adminPage.addSystemUser(
      { userRole: 'Admin', employeeName, status: 'Enabled', username, password },
      employeeName,
    );

    const firstSuccess = await adminPage.getSuccessMessage();
    expect(firstSuccess).toBeTruthy();

    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.clickAddUser();
    expect(await adminPage.isAddUserFormDisplayed()).toBe(true);

    await adminPage.addSystemUser(
      { userRole: 'Admin', employeeName, status: 'Enabled', username, password },
      employeeName,
    );

    await expect(adminPage.page.getByText('Already exists')).toBeVisible();
  });

  test('shows validation errors when required fields are empty', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.clickAddUser();
    expect(await adminPage.isAddUserFormDisplayed()).toBe(true);

    await adminPage.clickFormSave();

    const errors = await adminPage.getFormErrorMessages();
    expect(errors.filter((e) => e === 'Required').length).toBeGreaterThanOrEqual(5);
    expect(errors.some((e) => /passwords do not match/i.test(e))).toBe(true);
  });

  test('password mismatch shows error', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.clickAddUser();
    expect(await adminPage.isAddUserFormDisplayed()).toBe(true);

    await adminPage.selectFormUserRole('Admin');
    await adminPage.selectFormStatus('Enabled');
    await adminPage.fillFormUsername(`pm_${DataGenerator.generateRandomString(6)}`);
    await adminPage.fillFormPassword('Password1@');
    await adminPage.fillFormConfirmPassword('DifferentPwd1@');
    await adminPage.clickFormSave();

    const errors = await adminPage.getFormErrorMessages();
    expect(errors.some((e) => /passwords do not match/i.test(e))).toBe(true);
  });

  test('cancel returns to admin user list', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.clickAddUser();
    expect(await adminPage.isAddUserFormDisplayed()).toBe(true);

    await adminPage.clickFormCancel();

    expect(await adminPage.isAdminPageLoaded()).toBe(true);
    expect(await adminPage.isAddUserButtonVisible()).toBe(true);
  });

  test('short username shows validation error', async ({ adminPage }) => {
    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.clickAddUser();
    expect(await adminPage.isAddUserFormDisplayed()).toBe(true);

    await adminPage.selectFormUserRole('Admin');
    await adminPage.selectFormStatus('Enabled');
    await adminPage.fillFormUsername('ab');
    await adminPage.fillFormPassword('Test@12345');
    await adminPage.fillFormConfirmPassword('Test@12345');
    await adminPage.clickFormSave();

    expect(await adminPage.isAddUserFormDisplayed()).toBe(true);
  });

  test('creates a user and can be found by exact username search', async ({ adminPage }) => {
    const employeeName = await getFirstEmployeeName(adminPage);
    const username = `search_${DataGenerator.generateRandomString(6)}`;
    const password = DataGenerator.generatePassword(10);

    await adminPage.clickAddUser();
    expect(await adminPage.isAddUserFormDisplayed()).toBe(true);

    await adminPage.addSystemUser(
      { userRole: 'Admin', employeeName, status: 'Enabled', username, password },
      employeeName,
    );

    const successMsg = await adminPage.getSuccessMessage();
    expect(successMsg).toBeTruthy();

    await adminPage.navigate();
    await adminPage.loadSystemUsers();
    await adminPage.searchByUsername(username);
    await adminPage.clickSearch();

    const recordsText = await adminPage.getRecordsFoundText();
    expect(recordsText).toMatch(/\(\d+\)\s*Record(s)? Found/);

    const rowIndex = await adminPage.findUserInTableByUsername(username);
    expect(rowIndex).toBe(0);
  });
});
