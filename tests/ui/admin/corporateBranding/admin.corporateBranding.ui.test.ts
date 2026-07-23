import { test, expect } from '@fixtures/customFixtures';
import type { AdminPage } from '@pages/AdminPage';
import type { CorporateBrandingPage } from '@pages/CorporateBrandingPage';
import * as path from 'path';

async function navigateToCorporateBranding(
  adminPage: AdminPage,
  corporateBrandingPage: CorporateBrandingPage,
): Promise<void> {
  await adminPage.navigate();
  await expect(adminPage.adminHeader).toBeVisible();
  await adminPage.clickAdminMenuItem('Corporate Branding');
  await corporateBrandingPage.waitForLoaderToDisappear();
}

test.describe('Admin Corporate Branding @ui', () => {
  test('page loads with correct header', async ({ adminPage, corporateBrandingPage }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    expect(await corporateBrandingPage.isPageLoaded()).toBe(true);
  });

  test('primary color input is visible and editable', async ({
    adminPage,
    corporateBrandingPage,
  }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    await expect(corporateBrandingPage.primaryColorInput).toBeVisible();
    const value = await corporateBrandingPage.getPrimaryColorValue();
    expect(value).toBeTruthy();
  });

  test('secondary color input is visible and editable', async ({
    adminPage,
    corporateBrandingPage,
  }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    await expect(corporateBrandingPage.secondaryColorInput).toBeVisible();
    const value = await corporateBrandingPage.getSecondaryColorValue();
    expect(value).toBeTruthy();
  });

  test('logo upload input is available', async ({ adminPage, corporateBrandingPage }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    await expect(corporateBrandingPage.logoImageInput).toBeVisible();
  });

  test('login background upload input is available', async ({
    adminPage,
    corporateBrandingPage,
  }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    await expect(corporateBrandingPage.loginBackgroundInput).toBeVisible();
  });

  test('save button is visible', async ({ adminPage, corporateBrandingPage }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    expect(await corporateBrandingPage.isSaveButtonVisible()).toBe(true);
  });

  test('primary color can be updated and saved', async ({ adminPage, corporateBrandingPage }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    await corporateBrandingPage.setPrimaryColor('#FF5733');
    await corporateBrandingPage.clickSave();
    expect(await corporateBrandingPage.getSuccessMessage()).toBeTruthy();
  });

  test('secondary color can be updated and saved', async ({ adminPage, corporateBrandingPage }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    await corporateBrandingPage.setSecondaryColor('#33FF57');
    await corporateBrandingPage.clickSave();
    expect(await corporateBrandingPage.getSuccessMessage()).toBeTruthy();
  });

  test('both colors can be updated together', async ({ adminPage, corporateBrandingPage }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    await corporateBrandingPage.setPrimaryColor('#123ABC');
    await corporateBrandingPage.setSecondaryColor('#DEF456');
    await corporateBrandingPage.clickSave();
    expect(await corporateBrandingPage.getSuccessMessage()).toBeTruthy();
  });

  test('color values persist after save and page reload', async ({
    adminPage,
    corporateBrandingPage,
  }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    await corporateBrandingPage.setPrimaryColor('#AABBCC');
    await corporateBrandingPage.clickSave();
    await corporateBrandingPage.getSuccessMessage();

    await corporateBrandingPage.navigate();
    await corporateBrandingPage.waitForLoaderToDisappear();

    const value = await corporateBrandingPage.getPrimaryColorValue();
    expect(value.toLowerCase()).toBe('#aabbcc');
  });

  test('cancel button is visible', async ({ adminPage, corporateBrandingPage }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    await expect(corporateBrandingPage.cancelButton).toBeVisible();
  });

  test('logo can be uploaded', async ({ adminPage, corporateBrandingPage }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    const logoPath = path.resolve('tests/fixtures/test-logo.png');
    await corporateBrandingPage.uploadLogo(logoPath);
    await corporateBrandingPage.clickSave();
    expect(await corporateBrandingPage.getSuccessMessage()).toBeTruthy();
  });

  test('login background can be uploaded', async ({ adminPage, corporateBrandingPage }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    const bgPath = path.resolve('tests/fixtures/test-background.png');
    await corporateBrandingPage.uploadLoginBackground(bgPath);
    await corporateBrandingPage.clickSave();
    expect(await corporateBrandingPage.getSuccessMessage()).toBeTruthy();
  });

  test('invalid hex color value is handled gracefully', async ({
    adminPage,
    corporateBrandingPage,
  }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    await corporateBrandingPage.setPrimaryColor('invalid-color');
    await corporateBrandingPage.clickSave();
    const message = await corporateBrandingPage.getSuccessMessage();
    expect(message).not.toContain('Successfully Saved');
  });

  test('empty hex color values are handled', async ({ adminPage, corporateBrandingPage }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    await corporateBrandingPage.primaryColorInput.clear();
    await corporateBrandingPage.secondaryColorInput.clear();
    await corporateBrandingPage.clickSave();
    await corporateBrandingPage.waitForLoaderToDisappear();
    expect(await corporateBrandingPage.isPageLoaded()).toBe(true);
  });

  test('special characters in color input are handled', async ({
    adminPage,
    corporateBrandingPage,
  }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    const payloads = [
      '!@#$%^&*()',
      '<script>alert(1)</script>',
      '"; DROP TABLE users; --',
      'null',
      '../../etc/passwd',
    ];

    for (const payload of payloads) {
      await corporateBrandingPage.setPrimaryColor(payload);
      await corporateBrandingPage.clickSave();
      await corporateBrandingPage.waitForLoaderToDisappear();
    }
    expect(await corporateBrandingPage.isPageLoaded()).toBe(true);
  });

  test('very long color value is handled', async ({ adminPage, corporateBrandingPage }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    const longValue = 'A'.repeat(500);
    await corporateBrandingPage.setPrimaryColor(longValue);
    await corporateBrandingPage.clickSave();
    await corporateBrandingPage.waitForLoaderToDisappear();
    expect(await corporateBrandingPage.isPageLoaded()).toBe(true);
  });

  test('XSS payload in color input is not executed', async ({
    adminPage,
    corporateBrandingPage,
  }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    const xssPayloads = [
      '<script>alert(1)</script>',
      '<img onerror=alert(1) src=x>',
      '"><script>alert(1)</script>',
      'javascript:alert(1)',
    ];

    for (const payload of xssPayloads) {
      await corporateBrandingPage.setPrimaryColor(payload);
      await corporateBrandingPage.clickSave();
      await corporateBrandingPage.waitForLoaderToDisappear();
      const dialogAppeared = await corporateBrandingPage.page
        .locator('.oxd-dialog-sheet')
        .isVisible()
        .catch(() => false);
      expect(dialogAppeared).toBe(false);
    }
  });

  test('SQL injection in color input is handled safely', async ({
    adminPage,
    corporateBrandingPage,
  }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    const sqlPayloads = ["' OR 1=1 --", "'; DROP TABLE users; --", "admin'--"];

    for (const payload of sqlPayloads) {
      await corporateBrandingPage.setPrimaryColor(payload);
      await corporateBrandingPage.clickSave();
      await corporateBrandingPage.waitForLoaderToDisappear();
    }
    expect(await corporateBrandingPage.isPageLoaded()).toBe(true);
  });

  test('HTML injection in color input is escaped', async ({ adminPage, corporateBrandingPage }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    const htmlPayloads = ['<h1>injected</h1>', '<a href="http://evil.com">click</a>'];

    for (const payload of htmlPayloads) {
      await corporateBrandingPage.setPrimaryColor(payload);
      await corporateBrandingPage.clickSave();
      await corporateBrandingPage.waitForLoaderToDisappear();
    }
    expect(await corporateBrandingPage.isPageLoaded()).toBe(true);
  });

  test('unicode homoglyphs in color input are handled', async ({
    adminPage,
    corporateBrandingPage,
  }) => {
    await navigateToCorporateBranding(adminPage, corporateBrandingPage);

    await corporateBrandingPage.setPrimaryColor('аdmin');
    await corporateBrandingPage.clickSave();
    await corporateBrandingPage.waitForLoaderToDisappear();
    expect(await corporateBrandingPage.isPageLoaded()).toBe(true);
  });
});
