import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductService } from 'src/app/core/product.service';
import { CartService } from 'src/app/core/cart.service';
import { Product } from 'src/app/core/product.model';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ProductGridComponent implements OnInit {
  @Input() searchTerm: string = '';

  products: Product[] = [];
  loading: boolean = true;
  error: string = '';

  justAdded: { [key: number]: boolean } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  get filteredProducts(): Product[] {
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

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

  handleAddToCart(product: Product): void {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    });
  
    this.justAdded[product.id] = true;
    setTimeout(() => {
      this.justAdded[product.id] = false;
    }, 2000);
  }

  transformUrl(url: string | undefined): string {
    if (!url) return '';
    return url.startsWith('/product-images') ? `http://localhost:3000${url}` : url;
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
