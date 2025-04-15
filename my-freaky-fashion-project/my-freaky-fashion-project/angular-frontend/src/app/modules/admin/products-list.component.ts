import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Product } from 'src/app/core/product.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  editingSlug: string | null = null;
  editFormData: Partial<Product> = {} as Partial<Product>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get<Product[]>('http://localhost:3000/api/products').subscribe({
      next: (data) => {
        this.products = data.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error fetching products: ' + err.message;
        this.loading = false;
      }
    });
  }

  handleDragStart(event: DragEvent, dragIndex: number): void {
    event.dataTransfer?.setData('text/plain', dragIndex.toString());
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  handleDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    const dragIndex = Number(event.dataTransfer?.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const newArr = [...this.products];
    const [removed] = newArr.splice(dragIndex, 1);
    newArr.splice(dropIndex, 0, removed);

    newArr.forEach((p, i) => p.sortOrder = i);

    newArr.forEach(prod => {
      this.http.put(`http://localhost:3000/api/products/${prod.slug}`, { sortOrder: prod.sortOrder }).subscribe();
    });

    this.products = newArr;
  }

  handleEdit(product: Product): void {
    this.editingSlug = product.slug;
    this.editFormData = { ...product };
  }

  handleInputChange(name: keyof Product, value: any): void {
    (this.editFormData as Record<string, any>)[name] = name === 'price' ? Number(value) : value;

  }

  handleSave(): void {
    if (!this.editingSlug) return;

    this.http.put<Product>(`http://localhost:3000/api/products/${this.editingSlug}`, this.editFormData).subscribe({
      next: (updatedProduct) => {
        this.products = this.products.map(p => p.slug === this.editingSlug ? updatedProduct : p);
        this.editingSlug = null;
        this.editFormData = {} as Partial<Product>;
      },
      error: () => alert('Error updating product')
    });
  }

  handleCancel(): void {
    this.editingSlug = null;
    this.editFormData = {} as Partial<Product>;
  }

  handleDelete(slug: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.http.delete(`http://localhost:3000/api/products/${slug}`).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.slug !== slug);
      },
      error: () => alert('Error deleting product')
    });
  }
}
