import { Page, Locator, expect } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly page: Page;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly productNames: Locator;
  readonly quantityDisplay: Locator;
  readonly priceDisplay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paymentInfo = page.locator('text=Payment Information:');
    this.shippingInfo = page.locator('text=Shipping Information:');
    this.itemTotal = page.locator('p:has-text("Item Total :")');
    this.tax = page.locator('p:has-text("Tax :")');
    this.total = page.locator('p:has-text("Total :")');
    this.finishButton = page.locator('button:has-text("Finish")');
    this.cancelButton = page.locator('button:has-text("Cancel")');
  }

  async finish() {
    await this.finishButton.click();
    await this.page.waitForURL('**/checkout-complete');
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getItemTotal(): Promise<number> {
    const text = await this.itemTotal.innerText();
    const match = text.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTax(): Promise<number> {
    const text = await this.tax.innerText();
    const match = text.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

async getTotal(): Promise<number> {
    const text = await this.page.locator('text=Total :').last().innerText();
    const match = text.match(/\\\$(\\d+\\.\\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async verifyPriceMath() {
    const itemTotal = await this.getItemTotal();
    const tax = await this.getTax();
    const total = await this.getTotal();
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  }

  async verifyPaymentInfoVisible() {
    await expect(this.paymentInfo).toBeVisible();
  }

  async verifyShippingInfoVisible() {
    await expect(this.shippingInfo).toBeVisible();
  }

  async verifyOverviewVisible() {
    await expect(this.paymentInfo).toBeVisible();
    await expect(this.shippingInfo).toBeVisible();
    await expect(this.finishButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }
}
