import { Page, Locator, expect } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly logo: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly userMenu: Locator;
  readonly favoritesOption: Locator;
  readonly logoutOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('a[href="/ecommerce"]');
    this.cartIcon = page.locator('.profile span[role="button"]');
    this.cartBadge = page.locator('.profile span.bg-qa-clr');
    this.userMenu = page.locator('button[data-slot="dropdown-menu-trigger"]');
    this.favoritesOption = page.locator('[role="menuitem"]:has-text("Favorites")');
    this.logoutOption = page.locator('[role="menuitem"]:has-text("Log out")');
  }

  async goToCart() {
    await this.cartIcon.click();
    await this.page.waitForURL('**/ecommerce/cart');
  }

  async openUserMenu() {
    await this.userMenu.click();
    await this.page.waitForTimeout(300);
  }

  async goToFavorites() {
    await this.openUserMenu();
    await this.favoritesOption.click();
    await this.page.waitForURL('**/ecommerce/favorites');
  }

  async logout() {
    await this.openUserMenu();
    await this.logoutOption.click();
  }

  async verifyCartBadge(count: string) {
    await expect(this.cartBadge).toHaveText(count);
  }

  async verifyCartBadgeHidden() {
    await expect(this.cartBadge).toHaveCount(0);
  }

  async verifyLogoVisible() {
    await expect(this.logo).toBeVisible();
  }

  async verifyUserEmail(email: string) {
    await expect(this.page.locator(`.user-name:has-text("${email}")`)).toBeVisible();
  }
}
