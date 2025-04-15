import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class ProductDetailComponent implements OnInit, OnDestroy {
  product!: Product;
  mainImage!: string;
  relatedProducts: Product[] = [];
  visibleProducts: Product[] = [];
  loading = true;
  error = '';
  justAdded = false;

  currentSlide: number = 0;
  itemsPerSlide: number = 5;

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

    this.updateItemsPerSlide();
    window.addEventListener('resize', this.updateItemsPerSlide.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateItemsPerSlide.bind(this));
  }

  updateItemsPerSlide(): void {
    const width = window.innerWidth;
    if (width >= 1400) {
      this.itemsPerSlide = 5;
    } else if (width >= 1200) {
      this.itemsPerSlide = 4;
    } else if (width >= 900) {
      this.itemsPerSlide = 3;
    } else if (width >= 600) {
      this.itemsPerSlide = 2;
    } else {
      this.itemsPerSlide = 1;
    }
    this.updateVisibleProducts();
  }

  fetchRelatedProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.relatedProducts = products
          .filter(p => p.id !== this.product.id)
          .sort(() => 0.5 - Math.random());
        this.currentSlide = 0;
        this.updateVisibleProducts();
      },
      error: (err) => console.error('Error fetching related products:', err)
    });
  }

  updateVisibleProducts(): void {
    const start = this.currentSlide * this.itemsPerSlide;
    const end = start + this.itemsPerSlide;
    this.visibleProducts = this.relatedProducts.slice(start, end);
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateVisibleProducts();
    }
  }

  nextSlide(): void {
    const maxSlide = Math.ceil(this.relatedProducts.length / this.itemsPerSlide) - 1;
    if (this.currentSlide < maxSlide) {
      this.currentSlide++;
      this.updateVisibleProducts();
    }
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

  dummySearchChange(): void {
    // Placeholder
  }
}
