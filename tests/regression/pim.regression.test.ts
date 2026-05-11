import { test, expect } from '@fixtures/customFixtures';
import { DataGenerator } from '@utils/dataGenerator';

test.describe('PIM Module - Regression Tests @regression', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.navigate();
  });

  test('should add a new employee with valid data', async ({ pimPage }) => {
    const employee = DataGenerator.generateEmployee();
    await pimPage.navigate();
    await pimPage.addEmployee(employee);

    const isPersonalDetailsShown = await pimPage.isPersonalDetailsDisplayed();
    expect(isPersonalDetailsShown).toBe(true);
  });

  test('should search for an existing employee', async ({ pimPage }) => {
    await pimPage.navigate();
    await pimPage.searchEmployee('Admin');

    await expect(pimPage.employeeNameField).toHaveValue(/Admin/);
  });

  test('should reset employee search results', async ({ pimPage }) => {
    await pimPage.navigate();
    await pimPage.searchEmployee('John');
    await pimPage.resetButton.click();

    expect(await pimPage.getText(pimPage.employeeNameField)).toBe('');
  });
});
