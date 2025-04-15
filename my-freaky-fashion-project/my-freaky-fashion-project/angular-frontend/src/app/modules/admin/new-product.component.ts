import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent {
  formData = {
    name: '',
    description: '',
    price: 0,
    sku: '',
    imageUrl: '',
    publishDate: '',
    slug: ''
  };

  file: File | null = null;
  errorMsg = '';

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.file = input.files[0];
    }
  }

  async handleSubmit(): Promise<void> {
    this.errorMsg = '';

    if (this.file && this.formData.imageUrl.trim()) {
      this.errorMsg = 'Please choose either an external Image URL or upload a file, not both.';
      return;
    }

    let slug = this.formData.slug;
    if (!slug && this.formData.name) {
      slug = this.generateSlug(this.formData.name);
    }

    if (this.file) {
      const form = new FormData();

      // Manually append and cast all values
      form.append('name', this.formData.name);
      form.append('description', this.formData.description);
      form.append('price', String(this.formData.price)); // ✅ cast number to string
      form.append('sku', this.formData.sku);
      form.append('imageUrl', this.formData.imageUrl);
      form.append('publishDate', this.formData.publishDate);
      form.append('slug', slug);
      form.append('imageFile', this.file);

      try {
        const res = await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          body: form
        });
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        this.resetForm();
      } catch (err) {
        console.error(err);
        this.errorMsg = 'Error adding product. See console.';
      }
    } else {
      const payload = { ...this.formData, slug };
      try {
        const res = await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        this.resetForm();
      } catch (err) {
        console.error(err);
        this.errorMsg = 'Error adding product. See console.';
      }
    }
  }

  resetForm() {
    this.formData = {
      name: '',
      description: '',
      price: 0,
      sku: '',
      imageUrl: '',
      publishDate: '',
      slug: ''
    };
    this.file = null;
  }
}
