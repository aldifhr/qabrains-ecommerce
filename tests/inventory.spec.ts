import { test, expect } from '../lib/base';

test.describe('Inventory Page - @inventory', () => {

  test.beforeEach(async ({ authPage }) => {
    await authPage.loginAsStandardUser();
  });

  test('TC-INV-01: Inventory page displays all products', async ({ inventoryPage }) => {
    await inventoryPage.verifyProductsVisible();
    const count = await inventoryPage.getProductCount();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('TC-INV-02: Product cards show name and price', async ({ inventoryPage, page }) => {
    const names = page.locator('a[href*="/product-details"] h4');
    const count = await names.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(names.nth(i)).not.toBeEmpty();
    }
  });

  test('TC-INV-03: Add to cart button changes to Remove after click', async ({ inventoryPage, page }) => {
    const addBtn = page.locator('button:has-text("Add to cart")').first();
    await addBtn.click();
    await page.waitForTimeout(500);
    const removeBtn = page.locator('button:has-text("Remove")').first();
    await expect(removeBtn).toBeVisible();
  });

  test('TC-INV-04: Sort products A to Z ascending', async ({ inventoryPage }) => {
    await inventoryPage.sortByOption('asc');
    await inventoryPage.verifySortedAscending();
  });

  test('TC-INV-05: Sort products Z to A descending', async ({ inventoryPage }) => {
    await inventoryPage.sortByOption('dsc');
    await inventoryPage.verifySortedDescending();
  });

  test('TC-INV-06: Sort products price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortByOption('low');
    await inventoryPage.verifySortedByPriceLowToHigh();
  });

  test('TC-INV-07: Sort products price high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortByOption('high');
    await inventoryPage.verifySortedByPriceHighToLow();
  });

  test('TC-INV-08: Add multiple products to cart updates badge', async ({ inventoryPage, header }) => {
    await inventoryPage.addProductToCart(0);
    await header.verifyCartBadge('1');
    await inventoryPage.addProductToCart(1);
    await header.verifyCartBadge('2');
  });

  test('TC-INV-09: Navigate to product detail page', async ({ inventoryPage, productDetailPage, page }) => {
    await inventoryPage.openProductDetail(0);
    await productDetailPage.verifyDetailVisible();
    await expect(page).toHaveURL(/product-details\?id=/);
  });
});
