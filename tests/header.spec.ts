import { test, expect } from '../lib/base';

test.describe('Header & Navigation - @header', () => {

  test.beforeEach(async ({ authPage }) => {
    await authPage.loginAsStandardUser();
  });

  test('TC-HDR-01: Logo is visible and links to inventory', async ({ header, page }) => {
    await header.verifyLogoVisible();
    await header.logo.click();
    await expect(page).toHaveURL(/.*ecommerce$/);
  });

  test('TC-HDR-02: User email is displayed in header', async ({ header }) => {
    await header.verifyUserEmail('test@qabrains.com');
  });

  test('TC-HDR-03: Cart icon navigates to cart page', async ({ header, page }) => {
    await header.goToCart();
    await expect(page).toHaveURL(/.*cart/);
  });

  test('TC-HDR-04: User menu dropdown shows Favorites and Logout', async ({ header, page }) => {
    await header.openUserMenu();
    await expect(header.favoritesOption).toBeVisible();
    await expect(header.logoutOption).toBeVisible();
  });

  test('TC-HDR-05: Logout clears session', async ({ header, page }) => {
    await header.logout();
    // After logout, accessing protected route should redirect to login
    await page.waitForURL(/.*(login|ecommerce)/, { timeout: 10000 });
    // Try to access cart - should redirect to login
    await page.goto('/ecommerce/cart', { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/.*login/, { timeout: 10000 });
  });

  test('TC-HDR-06: Favorites page accessible from menu', async ({ header, page }) => {
    await header.goToFavorites();
    await expect(page).toHaveURL(/.*favorites/);
  });

  test('TC-HDR-07: Cart badge hidden when no items', async ({ header }) => {
    await header.verifyCartBadgeHidden();
  });
});
