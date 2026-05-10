import { test, expect } from '../lib/base';

test.describe('Checkout Flow - Negative Cases - @negative @checkout', () => {

  test.beforeEach(async ({ authPage, inventoryPage }) => {
    // Standard setup: login and add one item to cart
    await authPage.loginAsStandardUser();
    await inventoryPage.addProductToCart(0);
  });

  test('TC-CHK-NEG-01: Cannot proceed to checkout if first name is empty', async ({ header, cartPage, checkoutInfoPage, page }) => {
    await header.goToCart();
    await cartPage.proceedToCheckout();
    
    // Fill only last name and zip code
    await checkoutInfoPage.lastNameInput.fill('Brains');
    await checkoutInfoPage.zipCodeInput.fill('12345');
    await checkoutInfoPage.continueButton.click({ force: true });

    // Verify form validation blocks navigation (URL remains checkout-info)
    expect(page.url()).toContain('checkout-info');
  });

  test('TC-CHK-NEG-02: Cannot proceed to checkout if last name is empty', async ({ header, cartPage, checkoutInfoPage, page }) => {
    await header.goToCart();
    await cartPage.proceedToCheckout();
    
    // Fill only first name and zip code
    await checkoutInfoPage.firstNameInput.fill('QA');
    await checkoutInfoPage.zipCodeInput.fill('12345');
    await checkoutInfoPage.continueButton.click({ force: true });

    // Verify form validation blocks navigation
    expect(page.url()).toContain('checkout-info');
  });

  test('TC-CHK-NEG-03: Cannot proceed to checkout if zip code is empty', async ({ header, cartPage, checkoutInfoPage, page }) => {
    await header.goToCart();
    await cartPage.proceedToCheckout();
    
    // Fill only first and last name
    await checkoutInfoPage.firstNameInput.fill('QA');
    await checkoutInfoPage.lastNameInput.fill('Brains');
    await checkoutInfoPage.continueButton.click({ force: true });

    // Verify form validation blocks navigation
    expect(page.url()).toContain('checkout-info');
  });

  test('TC-CHK-NEG-04: Cannot proceed to checkout if all form fields are empty', async ({ header, cartPage, checkoutInfoPage, page }) => {
    await header.goToCart();
    await cartPage.proceedToCheckout();
    
    // Attempt to continue without filling anything
    await checkoutInfoPage.continueButton.click({ force: true });

    // Verify form validation blocks navigation
    expect(page.url()).toContain('checkout-info');
  });

  test('TC-CHK-NEG-05: Cannot checkout with empty cart', async ({ header, cartPage, checkoutInfoPage, page }) => {
    await header.goToCart();
    // Empty the cart
    await cartPage.removeProduct(0);
    
    // Verify the checkout button is actually hidden when cart is empty
    await expect(cartPage.checkoutButton).toBeHidden();
  });
});
