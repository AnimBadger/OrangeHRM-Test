import { test, expect } from '@fixtures/customFixtures';

test.describe('Social Media Links @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('displays all social media icons on the login page', async ({ loginPage }) => {
    const isVisible = await loginPage.areSocialLinksVisible();
    expect(isVisible).toBe(true);

    for (const link of loginPage.socialLinks) {
      await expect(link.locator).toBeVisible();
    }
  });

  test('has correct href attributes for all social links', async ({ loginPage }) => {
    for (const link of loginPage.socialLinks) {
      await expect(link.locator).toHaveAttribute('href', new RegExp(link.hrefExpectedUrl, 'i'));
    }
  });

  test('opens all social links in a new tab with target=_blank', async ({ loginPage }) => {
    for (const link of loginPage.socialLinks) {
      await expect(link.locator).toHaveAttribute('target', '_blank');
    }
  });

  test('linkedin link redirects to OrangeHRM linkedin page', async ({ loginPage }) => {
    const linkedIn = await loginPage.getSocialLinkByName('LinkedIn');
    expect(linkedIn).toBeDefined();
    await loginPage.verifySocialLinkRedirects(linkedIn!);
  });

  test('facebook link redirects to OrangeHRM facebook page', async ({ loginPage }) => {
    const facebook = await loginPage.getSocialLinkByName('Facebook');
    expect(facebook).toBeDefined();
    await loginPage.verifySocialLinkRedirects(facebook!);
  });

  test('twitter link redirects to OrangeHRM twitter page', async ({ loginPage }) => {
    const twitter = await loginPage.getSocialLinkByName('Twitter');
    expect(twitter).toBeDefined();
    await loginPage.verifySocialLinkRedirects(twitter!);
  });

  test('youtube link redirects to OrangeHRM youtube page', async ({ loginPage }) => {
    const youTube = await loginPage.getSocialLinkByName('YouTube');
    expect(youTube).toBeDefined();
    await loginPage.verifySocialLinkRedirects(youTube!);
  });
});
