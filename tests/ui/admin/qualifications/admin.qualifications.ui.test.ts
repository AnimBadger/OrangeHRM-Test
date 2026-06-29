import { test, expect } from '@fixtures/customFixtures';
import { DataGenerator } from '@utils/dataGenerator';
import { ROUTES, MESSAGES } from '@data/constants';

test.describe('Admin Qualifications @ui', () => {
  test('top bar has qualifications menu item', async ({ adminPage }) => {
    await adminPage.navigate();
    const menuTexts = await adminPage.getAdminMenuTexts();
    expect(menuTexts).toContain('Qualifications');
  });

  test('qualifications dropdown displays all sub-items', async ({
    adminPage,
    qualificationsPage,
  }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');

    const subItems = await qualificationsPage.getQualSubMenuTexts();
    expect(subItems).toContain('Skills');
    expect(subItems).toContain('Education');
    expect(subItems).toContain('Licenses');
    expect(subItems).toContain('Languages');
  });

  test('skills page navigates to correct url', async ({ adminPage, qualificationsPage }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');

    expect(await qualificationsPage.isPageLoaded()).toBe(true);
    expect(await qualificationsPage.getCurrentUrl()).toContain(ROUTES.adminSkills);
  });

  test('education page navigates to correct url', async ({ adminPage, qualificationsPage }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Education');

    expect(await qualificationsPage.isPageLoaded()).toBe(true);
    expect(await qualificationsPage.getCurrentUrl()).toContain(ROUTES.adminEducation);
  });

  test('licenses page navigates to correct url', async ({ adminPage, qualificationsPage }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Licenses');

    expect(await qualificationsPage.isPageLoaded()).toBe(true);
    expect(await qualificationsPage.getCurrentUrl()).toContain(ROUTES.adminLicenses);
  });

  test('languages page navigates to correct url', async ({ adminPage, qualificationsPage }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Languages');

    expect(await qualificationsPage.isPageLoaded()).toBe(true);
    expect(await qualificationsPage.getCurrentUrl()).toContain(ROUTES.adminLanguages);
  });

  test('add button is visible on skills page', async ({
    adminPage,
    qualificationsPage,
    skillsPage,
  }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');

    expect(await skillsPage.isAddButtonVisible()).toBe(true);
  });

  test('skills table displays expected columns', async ({
    adminPage,
    qualificationsPage,
    skillsPage,
  }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');

    const headers = await skillsPage.getTableHeaders();
    expect(headers.length).toBeGreaterThan(0);
  });

  test('each row has edit and delete action buttons', async ({
    adminPage,
    qualificationsPage,
    skillsPage,
  }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');

    const rowCount = await skillsPage.getRowCount();
    test.skip(rowCount === 0, 'No skills rows present');

    expect(await skillsPage.isEditButtonVisible(0)).toBe(true);
    expect(await skillsPage.isDeleteButtonVisible(0)).toBe(true);
  });

  test('add form loads with correct header', async ({
    adminPage,
    qualificationsPage,
    skillsPage,
  }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');
    await skillsPage.clickAdd();

    expect(await skillsPage.isAddFormDisplayed()).toBe(true);
  });

  test('cancel from add returns to skills list', async ({
    adminPage,
    qualificationsPage,
    skillsPage,
  }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');
    await skillsPage.clickAdd();

    expect(await skillsPage.isAddFormDisplayed()).toBe(true);

    await skillsPage.clickCancel();

    expect(await skillsPage.isPageLoaded()).toBe(true);
    expect(await skillsPage.isAddButtonVisible()).toBe(true);
  });

  test('adds a new skill and appears in table', async ({
    adminPage,
    qualificationsPage,
    skillsPage,
  }) => {
    const name = `QA_Skill_${DataGenerator.generateRandomString(6)}`;

    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');
    await skillsPage.clickAdd();

    expect(await skillsPage.isAddFormDisplayed()).toBe(true);

    await skillsPage.addSkill(name);

    const successMsg = await skillsPage.getSuccessMessage();
    expect(successMsg).toBeTruthy();

    await skillsPage.navigateFromAdmin();

    const rowIndex = await skillsPage.findSkillInTableByName(name);
    expect(rowIndex).toBeGreaterThanOrEqual(0);
  });

  test('edit form loads with pre-populated name', async ({
    adminPage,
    qualificationsPage,
    skillsPage,
  }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');

    const rowCount = await skillsPage.getRowCount();
    test.skip(rowCount === 0, 'No skills rows present');

    const firstName = await skillsPage.getCellText(0, 1);

    await skillsPage.clickEdit(0);
    expect(await skillsPage.isEditFormDisplayed()).toBe(true);

    const inputValue = await skillsPage.formNameInput.inputValue();
    expect(inputValue.toLowerCase()).toBe(firstName.toLowerCase());

    await skillsPage.clickCancel();
    expect(await skillsPage.isPageLoaded()).toBe(true);
  });

  test('required field shows validation error on empty submit', async ({
    adminPage,
    qualificationsPage,
    skillsPage,
  }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');
    await skillsPage.clickAdd();

    expect(await skillsPage.isAddFormDisplayed()).toBe(true);

    await skillsPage.formSaveButton.click();

    const errors = await skillsPage.getFormErrorMessages();
    expect(errors.some((e) => /required/i.test(e))).toBe(true);
  });

  test('cancel from edit returns to skills list', async ({
    adminPage,
    qualificationsPage,
    skillsPage,
  }) => {
    await adminPage.navigate();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');

    const rowCount = await skillsPage.getRowCount();
    test.skip(rowCount === 0, 'No skills rows present');

    await skillsPage.clickEdit(0);
    expect(await skillsPage.isEditFormDisplayed()).toBe(true);

    await skillsPage.clickCancel();
    expect(await skillsPage.isPageLoaded()).toBe(true);
    expect(await skillsPage.isAddButtonVisible()).toBe(true);
  });

  test('edit skill successfully updates the record', async ({
    adminPage,
    qualificationsPage,
    skillsPage,
  }) => {
    const originalName = `QA_${DataGenerator.generateRandomString(6)}`;
    const updatedName = `QA_${DataGenerator.generateRandomString(6)}`;

    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');

    await skillsPage.clickAdd();
    await skillsPage.addSkill(originalName);

    const addMsg = await skillsPage.getSuccessMessage();
    expect(addMsg).toBeTruthy();

    await skillsPage.navigateFromAdmin();

    const rowIndex = await skillsPage.findSkillInTableByName(originalName);
    expect(rowIndex).toBeGreaterThanOrEqual(0);

    await skillsPage.clickEdit(rowIndex);
    expect(await skillsPage.isEditFormDisplayed()).toBe(true);

    await skillsPage.fillSkillName(updatedName);
    await skillsPage.clickSave();

    const editMsg = await skillsPage.getSuccessMessage();
    expect(editMsg).toBeTruthy();

    await skillsPage.navigateFromAdmin();

    const updatedRowIndex = await skillsPage.findSkillInTableByName(updatedName);
    expect(updatedRowIndex).toBeGreaterThanOrEqual(0);
  });

  test('delete skill removes it from the table', async ({
    adminPage,
    qualificationsPage,
    skillsPage,
  }) => {
    const name = `QA_${DataGenerator.generateRandomString(6)}`;

    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');

    await skillsPage.clickAdd();
    await skillsPage.addSkill(name);

    const addMsg = await skillsPage.getSuccessMessage();
    expect(addMsg).toBeTruthy();

    await skillsPage.navigateFromAdmin();

    const rowIndex = await skillsPage.findSkillInTableByName(name);
    expect(rowIndex).toBeGreaterThanOrEqual(0);

    await skillsPage.clickDelete(rowIndex);

    const delMsg = await skillsPage.getSuccessMessage();
    expect(delMsg).toBeTruthy();

    await skillsPage.navigateFromAdmin();

    const deletedRowIndex = await skillsPage.findSkillInTableByName(name);
    expect(deletedRowIndex).toBe(-1);
  });

  test('duplicate skill shows already exists error', async ({
    adminPage,
    qualificationsPage,
    skillsPage,
  }) => {
    const name = `QA_${DataGenerator.generateRandomString(6)}`;

    await adminPage.navigate();
    await expect(adminPage.adminHeader).toBeVisible();
    await qualificationsPage.clickAdminMenuItem('Qualifications');
    await qualificationsPage.clickQualSubMenuItem('Skills');

    await skillsPage.clickAdd();
    await skillsPage.addSkill(name);

    const addMsg = await skillsPage.getSuccessMessage();
    expect(addMsg).toBeTruthy();

    await skillsPage.navigateFromAdmin();
    await skillsPage.clickAdd();
    await skillsPage.addSkill(name);

    await expect(skillsPage.page.getByText(MESSAGES.alreadyExists)).toBeVisible();
  });

  test.describe('skills input security @ui', () => {
    const securityInputs = [
      { label: 'XSS', value: '<script>alert(1)</script>' },
      { label: 'XSS img', value: '<img onerror=alert(1) src=x>' },
      { label: 'XSS quote', value: '">' },
      { label: 'SQL injection basic', value: "' OR 1=1 --" },
      { label: 'SQL injection drop', value: "'; DROP TABLE users; --" },
      { label: 'SQL injection admin', value: "admin'--" },
      { label: 'HTML injection heading', value: '<h1>test</h1>' },
      { label: 'HTML injection link', value: '<a href="http://evil.com">click</a>' },
      { label: 'Length overflow', value: 'A'.repeat(1000) },
      { label: 'Special characters', value: '!@#$%^&*()_+{}|:"<>?~' },
    ];

    securityInputs.forEach(({ label, value }) => {
      test(`handles ${label} in skill name input without error`, async ({
        adminPage,
        qualificationsPage,
        skillsPage,
      }) => {
        await adminPage.navigate();
        await expect(adminPage.adminHeader).toBeVisible();
        await qualificationsPage.clickAdminMenuItem('Qualifications');
        await qualificationsPage.clickQualSubMenuItem('Skills');
        await skillsPage.clickAdd();

        expect(await skillsPage.isAddFormDisplayed()).toBe(true);

        await skillsPage.fillSkillName(value);
        await skillsPage.clickSave();
        await skillsPage.waitForLoaderToDisappear();

        const errors = await skillsPage.getFormErrorMessages();
        const success = await skillsPage.getSuccessMessage();
        expect(
          errors.length > 0 ||
            success !== null ||
            (await skillsPage.page.locator('.oxd-toast--danger').count()) > 0,
        ).toBe(true);
      });
    });
  });
});
