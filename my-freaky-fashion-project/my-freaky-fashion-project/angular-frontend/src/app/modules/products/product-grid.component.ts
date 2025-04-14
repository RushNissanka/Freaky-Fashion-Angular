import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from 'src/app/core/product.service';
import { Product } from 'src/app/core/product.model';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule] // ✅ Now supports [routerLink]
})
export class ProductGridComponent implements OnInit {
  @Input() searchTerm: string = '';

  products: Product[] = [];
  loading: boolean = true;
  error: string = '';

  // Emulates "justAdded" state similar to React's useState hook.
  justAdded: { [key: number]: boolean } = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  // Filter products based on the search term.
  get filteredProducts(): Product[] {
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Fetch products from the backend via ProductService.
  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to fetch products';
        this.loading = false;
      }
    });
  }

  // Handle add-to-cart action (replace with real cart logic later).
  handleAddToCart(product: Product): void {
    this.justAdded[product.id] = true;
    setTimeout(() => {
      this.justAdded[product.id] = false;
    }, 2000);
  }

  // Transform a local image URL to a full URL for display.
  transformUrl(url: string | undefined): string {
    if (!url) return '';
    return url.startsWith('/product-images') ? `http://localhost:3000${url}` : url;
  }

  // ✅ Used in *ngFor to optimize rendering
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
