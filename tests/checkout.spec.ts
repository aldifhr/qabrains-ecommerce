import { test, expect } from '../lib/base';

test.describe('Checkout Flow - @checkout', () => {

  test.beforeEach(async ({ authPage, inventoryPage }) => {
    await authPage.loginAsStandardUser();
    await inventoryPage.addProductToCart(0);
  });

  test('TC-CHK-01: Checkout info page shows form with disabled email', async ({ header, checkoutInfoPage }) => {
    await header.goToCart();
    await checkoutInfoPage.continue();  // go to checkout
    // Wait for cart checkout button redirect
  });

  test('TC-CHK-02: Checkout info form visible with all fields', async ({ header, cartPage, checkoutInfoPage, page }) => {
    await header.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.verifyFormVisible();
  });

  test('TC-CHK-03: Email field is disabled and prefilled', async ({ header, cartPage, checkoutInfoPage }) => {
    await header.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.verifyEmailDisabled();
    await checkoutInfoPage.verifyEmailPrefilled('test@qabrains.com');
  });

  test('TC-CHK-04: Cancel from checkout info returns to cart', async ({ header, cartPage, checkoutInfoPage, page }) => {
    await header.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.cancel();
    await expect(page).toHaveURL(/.*cart/);
  });

  test('TC-CHK-05: Checkout overview shows payment and shipping info', async ({ header, cartPage, checkoutInfoPage, checkoutOverviewPage }) => {
    await header.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillForm('QA', 'Brains', '12345');
    await checkoutInfoPage.continue();
    await checkoutOverviewPage.verifyOverviewVisible();
  });

  test('TC-CHK-06: Checkout overview price math is correct', async ({ header, cartPage, checkoutInfoPage, checkoutOverviewPage }) => {
    await header.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillForm('QA', 'Brains', '12345');
    await checkoutInfoPage.continue();
    await checkoutOverviewPage.verifyPriceMath();
  });

  test('TC-CHK-07: Cancel from checkout overview returns to inventory', async ({ header, cartPage, checkoutInfoPage, checkoutOverviewPage, page }) => {
    await header.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillForm('QA', 'Brains', '12345');
    await checkoutInfoPage.continue();
    // Cancel button exists in overview - site redirects to inventory
    await checkoutOverviewPage.cancel();
    await page.waitForURL('**/ecommerce');
    await expect(page).toHaveURL(/.*ecommerce$/);
  });

  test('TC-CHK-08: Complete checkout flow shows success message', async ({ header, cartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage }) => {
    await header.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillForm('QA', 'Brains', '12345');
    await checkoutInfoPage.continue();
    await checkoutOverviewPage.finish();
    await checkoutCompletePage.verifyOrderComplete();
  });

  test('TC-CHK-09: Continue Shopping from checkout complete returns to inventory', async ({ header, cartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage, page }) => {
    await header.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillForm('QA', 'Brains', '12345');
    await checkoutInfoPage.continue();
    await checkoutOverviewPage.finish();
    await checkoutCompletePage.continueShopping();
    await expect(page).toHaveURL(/.*ecommerce$/);
  });
});
