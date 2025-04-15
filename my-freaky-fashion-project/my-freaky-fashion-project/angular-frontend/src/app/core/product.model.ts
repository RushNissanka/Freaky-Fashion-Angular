export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;

  // 🆕 Add these missing fields
  sku?: string;
  publishDate?: string;
  sortOrder?: number;
}
