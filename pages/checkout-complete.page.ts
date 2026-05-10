import { Page, Locator, expect } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;
  readonly thankYouMessage: Locator;
  readonly orderDispatchedMessage: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.thankYouMessage = page.locator('h3:has-text("THANK YOU FOR YOUR ORDER!")');
    this.orderDispatchedMessage = page.locator('text=Your order has been dispatched');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
  }

  async verifyOrderComplete() {
    await expect(this.thankYouMessage).toBeVisible();
    await expect(this.orderDispatchedMessage).toBeVisible();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
