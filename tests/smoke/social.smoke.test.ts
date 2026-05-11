import { test, expect } from '@fixtures/customFixtures';

test.describe('Social Media Links @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should display all social media icons on the login page', async ({ loginPage }) => {
    const isVisible = await loginPage.areSocialLinksVisible();
    expect(isVisible).toBe(true);

    for (const link of loginPage.socialLinks) {
      await expect(link.locator).toBeVisible();
    }
  });

  test('should have correct href attributes for all social links', async ({ loginPage }) => {
    for (const link of loginPage.socialLinks) {
      await expect(link.locator).toHaveAttribute('href', new RegExp(link.hrefExpectedUrl, 'i'));
    }
  });

  test('should open all social links in a new tab with target=_blank', async ({ loginPage }) => {
    for (const link of loginPage.socialLinks) {
      await expect(link.locator).toHaveAttribute('target', '_blank');
    }
  });

  test('LinkedIn link should redirect to OrangeHRM LinkedIn page', async ({ loginPage }) => {
    const linkedIn = await loginPage.getSocialLinkByName('LinkedIn');
    expect(linkedIn).toBeDefined();
    await loginPage.verifySocialLinkRedirects(linkedIn!);
  });

  test('Facebook link should redirect to OrangeHRM Facebook page', async ({ loginPage }) => {
    const facebook = await loginPage.getSocialLinkByName('Facebook');
    expect(facebook).toBeDefined();
    await loginPage.verifySocialLinkRedirects(facebook!);
  });

  test('Twitter link should redirect to OrangeHRM Twitter page', async ({ loginPage }) => {
    const twitter = await loginPage.getSocialLinkByName('Twitter');
    expect(twitter).toBeDefined();
    await loginPage.verifySocialLinkRedirects(twitter!);
  });

  test('YouTube link should redirect to OrangeHRM YouTube page', async ({ loginPage }) => {
    const youTube = await loginPage.getSocialLinkByName('YouTube');
    expect(youTube).toBeDefined();
    await loginPage.verifySocialLinkRedirects(youTube!);
  });
});
