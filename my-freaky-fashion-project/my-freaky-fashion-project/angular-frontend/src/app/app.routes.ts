import { Routes } from '@angular/router';
import { ProductGridComponent } from './modules/products/product-grid.component';
import { ProductsListComponent } from './modules/admin/products-list.component';
import { NewProductComponent } from './modules/admin/new-product.component';

export const routes: Routes = [
  // 🔀 Redirect base URL ('/') to '/products'
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  // 📦 Public product listing
  { path: 'products', component: ProductGridComponent },

  // 🔍 Lazy-loaded product detail
  {
    path: 'products/:slug',
    loadComponent: () =>
      import('./modules/products/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      )
  },

  // 🛒 Lazy-loaded Cart Page
  {
    path: 'cart',
    loadComponent: () =>
      import('./modules/cart/cart.component').then(
        (m) => m.CartComponent
      )
  },

  // 💳 Lazy-loaded Checkout Page
  {
    path: 'checkout',
    loadComponent: () =>
      import('./modules/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      )
  },

  // 🛠 Admin Routes
  { path: 'admin/products', component: ProductsListComponent },
  { path: 'admin/new', component: NewProductComponent }
];
