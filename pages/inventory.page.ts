import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly addToCartButtons: Locator;
  readonly sortDropdown: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButtons = page.locator('button:has-text("Add to cart")');
    this.sortDropdown = page.locator('button:has-text("Select...")');
    this.productCards = page.locator('a[href*="/product-details"]');
    this.productNames = page.locator('a[href*="/product-details"]:has-text("Name")');
    this.productPrices = page.locator('a[href*="/product-details"] ~ p, a[href*="/product-details"] + p');
  }

  async addProductToCart(index: number = 0) {
    await this.addToCartButtons.nth(index).click();
    await this.page.waitForTimeout(500);
  }

  async openProductDetail(index: number = 0) {
    const links = this.page.locator('a[href*="/product-details"]');
    await links.nth(index).click();
    await this.page.waitForURL('**/product-details**');
  }

  async sortByOption(optionValue: string) {
    await this.sortDropdown.click();
    await this.page.waitForTimeout(300);
    await this.page.locator(`[data-value="${optionValue}"]`).click();
    await this.page.waitForTimeout(500);
  }

  async getProductCount() {
    return await this.addToCartButtons.count();
  }

  async getProductName(index: number = 0) {
    const names = this.page.locator('a[href*="/product-details"]');
    return await names.nth(index).innerText();
  }

  async getProductPrice(index: number = 0) {
    const cards = this.page.locator('a[href*="/product-details"]');
    const card = cards.nth(index);
    // Price is in a p tag with $ sign, after the card or as sibling
    const priceEl = card.locator('xpath=following-sibling::p[contains(., "$")]').first();
    if (await priceEl.count() > 0) {
      return await priceEl.innerText();
    }
    // Fallback: look for price in nearby p tags
    const nearby = this.page.locator(`a[href*="/product-details"]:nth-of-type(${index+1}) ~ p`).filter({ hasText: /\$\d+/ });
    return await nearby.first().innerText();
  }

  async verifyProductsVisible() {
    const count = await this.addToCartButtons.count();
    expect(count).toBeGreaterThan(0);
  }

  async verifyProductAt(index: number, expectedName: string) {
    const name = await this.getProductName(index);
    expect(name).toContain(expectedName);
  }

  async verifySortedAscending() {
    const count = await this.getProductCount();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(await this.getProductName(i));
    }
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  }

  async verifySortedDescending() {
    const count = await this.getProductCount();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(await this.getProductName(i));
    }
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  }

  async verifySortedByPriceLowToHigh() {
    const count = await this.getProductCount();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const priceText = await this.getProductPrice(i);
      const price = parseFloat(priceText.replace('$', ''));
      prices.push(price);
    }
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  }

  async verifySortedByPriceHighToLow() {
    const count = await this.getProductCount();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const priceText = await this.getProductPrice(i);
      const price = parseFloat(priceText.replace('$', ''));
      prices.push(price);
    }
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  }
}
