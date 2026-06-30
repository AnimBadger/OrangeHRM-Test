import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, LABELS, MESSAGES } from '@data/constants';
import logger from '@utils/logger';

export class SocialLink {
  readonly locator: Locator;
  readonly expectedUrl: string;
  readonly name: string;
  readonly hrefExpectedUrl: string;

  constructor(locator: Locator, expectedUrl: string, name: string, hrefExpectedUrl?: string) {
    this.locator = locator;
    this.expectedUrl = expectedUrl;
    this.name = name;
    this.hrefExpectedUrl = hrefExpectedUrl ?? expectedUrl;
  }
}

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly orangeHrmLogo: Locator;
  readonly socialLinksContainer: Locator;
  readonly socialLinks: SocialLink[];
  readonly requiredFieldErrors: Locator;
  readonly forgotPasswordTitle: Locator;
  readonly resetUsernameInput: Locator;
  readonly resetPasswordButton: Locator;
  readonly cancelButton: Locator;
  readonly resetSuccessMessage: Locator;
  readonly resetSuccessHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
    this.orangeHrmLogo = page.locator('.orangehrm-login-branding img');
    this.socialLinksContainer = page.locator('.orangehrm-login-footer-sm');
    this.requiredFieldErrors = page.locator('.oxd-input-group span.oxd-text');
    this.forgotPasswordTitle = page.locator('.orangehrm-forgot-password-title');
    this.resetUsernameInput = page.locator(
      '.orangehrm-forgot-password-container input[name="username"]',
    );
    this.resetPasswordButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.resetSuccessMessage = page.getByText(MESSAGES.resetEmailSent);
    this.resetSuccessHeader = page.locator('h6:has-text("Reset Password link sent successfully")');

    this.socialLinks = [
      new SocialLink(
        this.socialLinksContainer.locator('a').nth(0),
        'linkedin.com/company/orangehrm',
        'LinkedIn',
      ),
      new SocialLink(
        this.socialLinksContainer.locator('a').nth(1),
        'facebook.com/orangehrm',
        'Facebook',
      ),
      new SocialLink(
        this.socialLinksContainer.locator('a').nth(2),
        'x.com/orangehrm',
        'Twitter',
        'twitter.com/orangehrm',
      ),
      new SocialLink(
        this.socialLinksContainer.locator('a').nth(3),
        'youtube.com/c/orangehrminc',
        'YouTube',
      ),
    ];
  }

  get url(): string {
    return ROUTES.login;
  }

  async login(username: string, password: string): Promise<void> {
    logger.info(`Logging in with username: ${username}`);
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForLoaderToDisappear();
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async getRequiredFieldErrors(): Promise<string[]> {
    const count = await this.requiredFieldErrors.count();
    const messages: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.requiredFieldErrors.nth(i).innerText();
      messages.push(text.trim());
    }
    return messages;
  }

  async isLoginPageDisplayed(): Promise<boolean> {
    return this.isVisible(this.orangeHrmLogo);
  }

  async verifyLoginPageTitle(): Promise<void> {
    await this.verifyPageTitle(LABELS.applicationName);
  }

  async getSocialLinkByName(name: string): Promise<SocialLink | undefined> {
    return this.socialLinks.find((link) => link.name === name);
  }

  async clickSocialLink(socialLink: SocialLink): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      socialLink.locator.click(),
    ]);
    await newPage.waitForLoadState('load');
    return newPage;
  }

  async verifySocialLinkRedirects(socialLink: SocialLink): Promise<void> {
    const newPage = await this.clickSocialLink(socialLink);
    try {
      const currentUrl = newPage.url().toLowerCase();
      expect(currentUrl).toContain(socialLink.expectedUrl);
    } finally {
      await newPage.close();
    }
  }

  async areSocialLinksVisible(): Promise<boolean> {
    return this.isVisible(this.socialLinksContainer);
  }

  async clickForgotPassword(): Promise<void> {
    logger.info('Clicking forgot password link');
    await this.click(this.forgotPasswordLink);
    await this.waitForPageLoad();
  }

  async submitForgotPassword(username: string): Promise<void> {
    logger.info(`Submitting forgot password for username: ${username}`);
    await this.fill(this.resetUsernameInput, username);
    await this.click(this.resetPasswordButton);
  }

  async clickCancel(): Promise<void> {
    logger.info('Clicking cancel on forgot password');
    await this.click(this.cancelButton);
    await this.waitForPageLoad();
  }

  async getForgotPasswordTitle(): Promise<string> {
    return this.getText(this.forgotPasswordTitle);
  }

  async getResetSuccessMessage(): Promise<string> {
    return this.getText(this.resetSuccessMessage);
  }

  async isForgotPasswordPage(): Promise<boolean> {
    return this.isVisible(this.forgotPasswordTitle);
  }
}
