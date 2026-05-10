import { Page, Locator, expect } from '@playwright/test';

export class FavoritesPage {
  readonly page: Page;
  readonly emptyMessage: Locator;
  readonly continueShoppingButton: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyMessage = page.locator('text=You have no favorite products');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
    this.sortDropdown = page.locator('button:has-text("Select...")');
  }

  async navigate() {
    await this.page.goto('/ecommerce/favorites', { waitUntil: 'domcontentloaded' });
  }

  async verifyEmptyFavorites() {
    await expect(this.emptyMessage).toBeVisible();
  }
}
