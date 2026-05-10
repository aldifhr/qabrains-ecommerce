import { test, expect } from '../lib/base';

test.describe('Product Detail Page - @product-detail', () => {

  test.beforeEach(async ({ authPage }) => {
    await authPage.loginAsStandardUser();
  });

  test('TC-PD-01: Product detail page shows name, price, and controls', async ({ productDetailPage, page }) => {
    await productDetailPage.navigateTo(1);
    await productDetailPage.verifyDetailVisible();
    await expect(page.locator('h2, h3').first()).toBeVisible();
  });

  test('TC-PD-02: Back to Products button returns to inventory', async ({ productDetailPage, page }) => {
    await productDetailPage.navigateTo(1);
    await productDetailPage.backToProducts();
    await expect(page).toHaveURL(/.*ecommerce$/);
  });

  test('TC-PD-03: Add to cart from detail page', async ({ productDetailPage, header }) => {
    await productDetailPage.navigateTo(1);
    await productDetailPage.addToCart();
    await header.verifyCartBadge('1');
  });

  test('TC-PD-04: Quantity +/- buttons visible on detail page', async ({ productDetailPage, page }) => {
    await productDetailPage.navigateTo(1);
    await productDetailPage.addToCart();
    const minusBtn = page.locator('button:has-text("−")').or(page.locator('button:has-text("-")'));
    const plusBtn = page.locator('button:has-text("+")');
    await expect(minusBtn).toBeVisible();
    await expect(plusBtn).toBeVisible();
  });
});
