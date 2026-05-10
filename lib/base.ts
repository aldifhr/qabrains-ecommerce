import { test as base } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { HeaderComponent } from '../components/header.component';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutInfoPage } from '../pages/checkout-info.page';
import { CheckoutOverviewPage } from '../pages/checkout-overview.page';
import { CheckoutCompletePage } from '../pages/checkout-complete.page';
import { FavoritesPage } from '../pages/favorites.page';
import { ProductDetailPage } from '../pages/product-detail.page';

type Pages = {
  authPage: AuthPage;
  header: HeaderComponent;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  favoritesPage: FavoritesPage;
  productDetailPage: ProductDetailPage;
};

export const test = base.extend<Pages>({
  authPage: async ({ page }, use) => { await use(new AuthPage(page)); },
  header: async ({ page }, use) => { await use(new HeaderComponent(page)); },
  inventoryPage: async ({ page }, use) => { await use(new InventoryPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutInfoPage: async ({ page }, use) => { await use(new CheckoutInfoPage(page)); },
  checkoutOverviewPage: async ({ page }, use) => { await use(new CheckoutOverviewPage(page)); },
  checkoutCompletePage: async ({ page }, use) => { await use(new CheckoutCompletePage(page)); },
  favoritesPage: async ({ page }, use) => { await use(new FavoritesPage(page)); },
  productDetailPage: async ({ page }, use) => { await use(new ProductDetailPage(page)); },
});

export { expect } from '@playwright/test';
