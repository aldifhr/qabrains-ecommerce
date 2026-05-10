import { test, expect } from '../lib/base';

test.describe('Cart Page - @cart', () => {

  test.beforeEach(async ({ authPage, inventoryPage }) => {
    await authPage.loginAsStandardUser();
    await inventoryPage.addProductToCart(0);
  });

  test('TC-CRT-01: Cart page shows added product', async ({ header, cartPage }) => {
    await header.goToCart();
    await cartPage.verifyCartNotEmpty();
  });

  test('TC-CRT-02: Cart badge shows correct count', async ({ header }) => {
    await header.verifyCartBadge('1');
  });

  test('TC-CRT-03: Remove product from cart via dialog', async ({ header, cartPage }) => {
    await header.goToCart();
    await cartPage.removeProduct(0);
    await cartPage.verifyCartEmpty();
  });

  test('TC-CRT-04: Continue Shopping returns to inventory', async ({ header, cartPage, page }) => {
    await header.goToCart();
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/.*ecommerce$/);
  });

  test('TC-CRT-05: Increment quantity updates to 2', async ({ header, cartPage }) => {
    await header.goToCart();
    await cartPage.incrementQuantity();
    const qty = await cartPage.getQuantity();
    expect(qty).toBe('2');
  });

  test('TC-CRT-06: Decrement quantity from 2 back to 1', async ({ header, cartPage }) => {
    await header.goToCart();
    await cartPage.incrementQuantity();
    await cartPage.decrementQuantity();
    const qty = await cartPage.getQuantity();
    expect(qty).toBe('1');
  });

  test('TC-CRT-07: Cart persists across page navigation', async ({ header, cartPage, page }) => {
    await header.goToCart();
    // Go back to inventory via logo
    await page.locator('a[href="/ecommerce"]').click();
    await page.waitForURL('**/ecommerce');
    await header.goToCart();
    await cartPage.verifyCartNotEmpty();
  });
});
