import { Routes } from '@angular/router';
import { ProductGridComponent } from './modules/products/product-grid.component';

export const routes: Routes = [
  // 🔀 Redirect base URL ('/') to '/products'
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  // 📦 When navigating to '/products', display ProductGridComponent
  { path: 'products', component: ProductGridComponent },

  // 🔍 Lazy-load standalone ProductDetailComponent
  {
    path: 'products/:slug',
    loadComponent: () =>
      import('./modules/products/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      )
  }
];
