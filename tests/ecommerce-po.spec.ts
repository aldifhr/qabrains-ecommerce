import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { Header } from '../components/header';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutInfoPage, CheckoutOverviewPage } from '../pages/checkout.page';

test.describe('QABrains E-commerce Automation - Page Objects', () => {

  let authPage: AuthPage;
  let header: Header;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutInfo: CheckoutInfoPage;
  let checkoutOverview: CheckoutOverviewPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    header = new Header(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutInfo = new CheckoutInfoPage(page);
    checkoutOverview = new CheckoutOverviewPage(page);

    await page.goto('/ecommerce/login', { waitUntil: 'domcontentloaded' });
    await authPage.login('test@qabrains.com', 'Password123');
    await page.waitForURL('**/ecommerce');
  });

  test('Verify login and product list visibility', async () => {
    await inventoryPage.verifyProductsAreVisible();
  });

  test('Add item to cart and verify cart badge', async () => {
    await inventoryPage.addProductToCart(0);
    await header.verifyCartBadgeCount('1');
  });

  test('Remove item from cart', async ({ page }) => {
    await inventoryPage.addProductToCart(0);
    await header.goToCart();
    await page.waitForURL('**/ecommerce/cart');
    
    const removeBtn = page.locator('button:has-text("Remove")');
    await removeBtn.click();
    
    // Accept the confirmation dialog that pops up
    const confirmBtn = page.locator('div[role="dialog"] button, div[data-state="open"] button').filter({ hasText: /yes|confirm|delete|remove|ok/i }).first();
    if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
    }
    
    await page.waitForTimeout(1000); // Wait for React state to update
    
    // Verify it's gone
    await expect(page.locator('button:has-text("Remove")')).toHaveCount(0);
  });

  test('Complete checkout flow', async ({ page }) => {
    await inventoryPage.addProductToCart(0);
    await header.goToCart();
    await page.waitForURL('**/ecommerce/cart');
    
    await cartPage.proceedToCheckout();
    await page.waitForURL('**/ecommerce/checkout-info');
    
    await checkoutInfo.fillDetails('QA', 'Brains', '12345');
    await checkoutInfo.continue();

    await page.waitForURL('**/ecommerce/checkout-overview');
    await checkoutOverview.finish();

    await page.waitForURL('**/ecommerce/checkout-complete');
    await expect(page.locator('text=Thank you for your order!')).toBeVisible();
  });
});
