import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly removeButton: Locator;
  readonly minusButton: Locator;
  readonly plusButton: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly quantityDisplay: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.removeButton = page.locator('button:has-text("Remove")');
    this.minusButton = page.locator('button:has-text("-")').last();
    this.plusButton = page.locator('button:has-text("+")').last();
    this.checkoutButton = page.locator('button:has-text("Checkout")');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
    this.productName = page.locator('.container .row').filter({ hasText: 'Remove' }).locator('p').first();
    this.productPrice = page.locator('.container .row').filter({ hasText: 'Remove' }).locator('p.text-sm').first();
  }

  async navigate() {
    await this.page.goto('/ecommerce/cart', { waitUntil: 'domcontentloaded' });
  }

  async removeProduct(index: number = 0) {
    await this.removeButton.nth(index).click();
    // Dialog asks "Are you absolutely sure?" with Remove + Close buttons
    const dialogRemoveBtn = this.page.locator('[role="dialog"] button:has-text("Remove")');
    await dialogRemoveBtn.waitFor({ state: "visible", timeout: 5000 });
    await dialogRemoveBtn.click();
    await this.page.waitForTimeout(500);
  }

  async incrementQuantity() {
    await this.plusButton.click();
    await this.page.waitForTimeout(300);
  }

  async decrementQuantity() {
    await this.minusButton.click();
    await this.page.waitForTimeout(300);
  }

  async getQuantity(): Promise<string> {
    const minus = this.page.locator('button:has-text("-")').last();
    const next = minus.locator('+ *');
    return (await next.innerText()).trim();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/checkout-info');
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async verifyCartNotEmpty() {
    await expect(this.removeButton.first()).toBeVisible();
  }

  async verifyCartEmpty() {
    await expect(this.checkoutButton).toBeDisabled();
  }

  async verifyProductInCart(name: string) {
    await expect(this.page.locator(`text=${name}`)).toBeVisible();
  }

  async getItemCount(): Promise<number> {
    return await this.removeButton.count();
  }
}
