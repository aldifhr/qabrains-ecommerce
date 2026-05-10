import { test, expect } from '../lib/base';

test.describe('Auth Login - @auth', () => {
  test('TC-AUTH-01: Login page shows all required elements', async ({ authPage }) => {
    await authPage.navigate();
    await authPage.verifyLoginPageVisible();
  });

  test('TC-AUTH-02: Successful login with valid credentials', async ({ authPage }) => {
    await authPage.loginAsStandardUser();
    await authPage.verifyLoginSuccess();
  });

  test('TC-AUTH-03: Failed login with invalid credentials', async ({ authPage }) => {
    await authPage.login('wrong@email.com', 'wrongpass');
    await authPage.verifyLoginError();
  });

  test('TC-AUTH-04: Login page email and password fields are required', async ({ authPage, page }) => {
    await authPage.navigate();
    await authPage.loginButton.click();
    await page.waitForTimeout(1000);
    // Should remain on login page
    await expect(page).toHaveURL(/.*login/);
  });
});
