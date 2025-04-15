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

  // 🛠 Admin Routes
  { path: 'admin/products', component: ProductsListComponent },
  { path: 'admin/new', component: NewProductComponent }
];
