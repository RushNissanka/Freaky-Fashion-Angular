import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ProductService } from '../../../core/product.service';
import { Product } from '../../../core/product.model';
import { CartService } from '../../../core/cart.service';

import { HeaderComponent } from 'src/app/shared/header/header.component';
import { FooterComponent } from 'src/app/shared/footer/footer.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  mainImage!: string;
  relatedProducts: Product[] = [];
  loading = true;
  error = '';
  justAdded = false;

  currentSlide: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.productService.getProductBySlug(slug).subscribe({
        next: (data) => {
          this.product = data;
          this.mainImage = data.imageUrl || '';
          this.loading = false;
          this.fetchRelatedProducts();
        },
        error: (err) => {
          this.error = err.message || 'Error fetching product';
          this.loading = false;
        }
      });
    }
  }

  fetchRelatedProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.relatedProducts = products
          .filter(p => p.id !== this.product.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        this.currentSlide = 0;
      },
      error: (err) => console.error('Error fetching related products:', err)
    });
  }

  handleAddToCart(): void {
    this.cartService.addToCart({ ...this.product, quantity: 1 });
    this.justAdded = true;
    setTimeout(() => (this.justAdded = false), 2000);
  }

  selectImage(url: string): void {
    this.mainImage = url;
  }

  get allImages(): string[] {
    return [
      this.product.imageUrl,
      this.product.imageUrl2,
      this.product.imageUrl3,
      this.product.imageUrl4,
      this.product.imageUrl5
    ].filter((url): url is string => !!url);
  }

  prevSlide(): void {
    if (this.relatedProducts.length > 0) {
      this.currentSlide = (this.currentSlide - 1 + this.relatedProducts.length) % this.relatedProducts.length;
    }
  }

  nextSlide(): void {
    if (this.relatedProducts.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.relatedProducts.length;
    }
  }

  dummySearchChange(): void {
    // Placeholder if needed
  }
}
