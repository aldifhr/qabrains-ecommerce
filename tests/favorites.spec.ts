import { test, expect } from '../lib/base';

test.describe('Favorites Page - @favorites', () => {

  test.beforeEach(async ({ authPage }) => {
    await authPage.loginAsStandardUser();
  });

  test('TC-FAV-01: Favorites page shows empty message when no favorites', async ({ favoritesPage }) => {
    await favoritesPage.navigate();
    await favoritesPage.verifyEmptyFavorites();
  });

  test('TC-FAV-02: Continue Shopping button on favorites returns to inventory', async ({ favoritesPage, page }) => {
    await favoritesPage.navigate();
    // The button might be an <a> tag with href
    const continueBtn = page.locator('button:has-text("Continue Shopping"), a:has-text("Continue Shopping")');
    await continueBtn.click();
    await expect(page).toHaveURL(/.*ecommerce$/);
  });
});
