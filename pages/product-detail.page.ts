import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly backButton: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly minusButton: Locator;
  readonly plusButton: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backButton = page.locator('button:has-text("Back to Products")');
    this.addToCartButton = page.locator('button:has-text("Add to cart")');
    this.removeButton = page.locator('button:has-text("Remove")');
    this.minusButton = page.locator('button:has-text("−")').or(page.locator('button:has-text("-")'));
    this.plusButton = page.locator('button:has-text("+")');
    this.productName = page.locator('h2, h3').first();
    this.productPrice = page.locator('p').filter({ hasText: /\$\d+/ }).first();
  }

  async navigateTo(id: number) {
    await this.page.goto(`/ecommerce/product-details?id=${id}`, { waitUntil: 'domcontentloaded' });
  }

  async addToCart() {
    await this.addToCartButton.click();
    await this.page.waitForTimeout(500);
  }

  async backToProducts() {
    await this.backButton.click();
  }

  async verifyDetailVisible() {
    await expect(this.backButton).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
  }

  async verifyProductName(expected: string) {
    await expect(this.page.locator(`h2:has-text("${expected}"), h3:has-text("${expected}")`)).toBeVisible();
  }
}
