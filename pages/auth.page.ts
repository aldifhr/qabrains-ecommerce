import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('text=Neither email nor password matched');
  }

  async navigate() {
    await this.page.goto('/ecommerce/login', { waitUntil: 'domcontentloaded' });
  }

  async login(email: string, password: string) {
    await this.navigate();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginAsStandardUser() {
    await this.login('test@qabrains.com', 'Password123');
    await this.page.waitForURL('**/ecommerce');
  }

  async verifyLoginPageVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async verifyLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async verifyLoginSuccess() {
    await expect(this.page).toHaveURL(/.*ecommerce$/);
  }
}
