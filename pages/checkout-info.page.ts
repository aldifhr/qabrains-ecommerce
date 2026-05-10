import { Page, Locator, expect } from '@playwright/test';

export class CheckoutInfoPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[disabled]').first();
    this.firstNameInput = page.locator('input[placeholder="Ex. John"]');
    this.lastNameInput = page.locator('input[placeholder="Ex. Doe"]');
    this.zipCodeInput = page.locator('input.form-control').nth(3);
    this.continueButton = page.locator('button:has-text("Continue")');
    this.cancelButton = page.locator('button:has-text("Cancel")');
  }

  async fillForm(firstName: string, lastName: string, zipCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async verifyEmailPrefilled(email: string) {
    await expect(this.emailInput).toHaveValue(email);
  }

  async verifyEmailDisabled() {
    await expect(this.emailInput).toBeDisabled();
  }

  async verifyFormVisible() {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.zipCodeInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }
}
