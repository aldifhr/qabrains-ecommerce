import { test, expect } from '@playwright/test';

test.describe('QABrains E-commerce Automation', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Go to Login page
    await page.goto('/ecommerce/login', { waitUntil: 'domcontentloaded' });

    // 2. Do Login
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', 'test@qabrains.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');

    // 3. Wait until landed on the main product listing
    await page.waitForURL('**/ecommerce');
    await expect(page).toHaveURL(/.*ecommerce$/);
  });

  test('Verify login and product list visibility', async ({ page }) => {
    // There are products listed
    await page.waitForSelector('button:has-text("Add to cart")');
    const products = await page.locator('button:has-text("Add to cart")').count();
    expect(products).toBeGreaterThan(0);
  });

  test('Add item to cart and verify cart badge', async ({ page }) => {
    // Click Add to cart for the first item
    await page.waitForSelector('button:has-text("Add to cart")');
    await page.locator('button:has-text("Add to cart")').first().click();

    // Verify cart badge (the number in the span top-right of the user icon)
    const cartBadge = page.locator('.profile span.text-white, .profile span.bg-qa-clr');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
  });

  test('Complete checkout flow', async ({ page }) => {
    // 1. Add item
    await page.waitForSelector('button:has-text("Add to cart")');
    await page.locator('button:has-text("Add to cart")').first().click();

    // 2. Go to cart (clicking the cart icon)
    await page.locator('.profile span[role="button"]').first().click();
    await page.waitForURL('**/ecommerce/cart');
    
    // Check if the item is there
    const checkoutBtn = page.locator('button:has-text("Checkout")');
    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();

    // 3. Checkout Info Page
    await page.waitForURL('**/ecommerce/checkout-info');
    
    // There are 4 inputs on this page, the first is disabled email.
    // Index 1 = FirstName, Index 2 = LastName, Index 3 = ZipCode
    const inputs = await page.$$('input[type="text"]');
    await inputs[1].fill('QA');
    await inputs[2].fill('Brains');
    await inputs[3].fill('12345');
    
    await page.click('button:has-text("Continue")');

    // 4. Checkout Overview
    await page.waitForURL('**/ecommerce/checkout-overview');
    await expect(page.locator('text=Payment Information')).toBeVisible();

    await page.click('button:has-text("Finish")');

    // 5. Checkout Complete
    await page.waitForURL('**/ecommerce/checkout-complete');
    await expect(page.locator('text=Thank you for your order!')).toBeVisible();
  });
});
