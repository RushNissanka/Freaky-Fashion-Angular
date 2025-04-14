/***************************************************************************** 
 *                          productRoutes.ts
 * 
 * Handles all product-related CRUD operations, including image uploads via 
 * Multer, image path transformation to URLs, and quantity support.
 *****************************************************************************/

import { Router, Request, Response } from 'express';
import multer, { StorageEngine } from 'multer';
import { initDB } from '../db';

const router = Router();

// ---------------------------------------------------------------------------
// 📦 Multer Setup for Image Uploads
// ---------------------------------------------------------------------------
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'product-images'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ---------------------------------------------------------------------------
// 🔗 Slug Generator
// ---------------------------------------------------------------------------
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ---------------------------------------------------------------------------
// 🖼 Transform Local Image Paths to Full URLs
// ---------------------------------------------------------------------------
function transformMultipleImages(product: any): any {
  if (!product) return product;

  const fields = ['imagePath', 'imagePath2', 'imagePath3', 'imagePath4', 'imagePath5'];
  fields.forEach((field) => {
    if (product[field]) {
      const urlField = field.replace('Path', 'Url');
      if (product[field].startsWith('/product-images')) {
        product[urlField] = `http://localhost:3000${product[field]}`;
      } else if (product[field].startsWith('http')) {
        product[urlField] = product[field];
      }
    }
  });

  return product;
}

// ---------------------------------------------------------------------------
// 🔍 GET /api/products - List all products
// ---------------------------------------------------------------------------
async function getAllProducts(req: Request, res: Response): Promise<void> {
  console.log('🟢 GET /api/products called');
  try {
    const db = await initDB();
    const products = await db.all(`
      SELECT DISTINCT
        id, name, description, price, sku, publishDate, slug,
        imagePath, imagePath2, imagePath3, imagePath4, imagePath5,
        quantity, sortOrder
      FROM products
      ORDER BY sortOrder
    `);

    const transformed = products.map(transformMultipleImages);
    res.json(transformed);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

// ---------------------------------------------------------------------------
// 🔍 GET /api/products/:slug - Get product by slug
// ---------------------------------------------------------------------------
async function getProductBySlug(req: Request<{ slug: string }>, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const db = await initDB();
    const product = await db.get(`
      SELECT * FROM products WHERE slug = ?
    `, [slug]);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(transformMultipleImages(product));
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

// ---------------------------------------------------------------------------
// ➕ POST /api/products - Create product
// ---------------------------------------------------------------------------
async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const { name, description, price, sku, imageUrl, publishDate, slug, quantity } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    let finalImagePath = '';
    // @ts-ignore
    if (req.file) {
      finalImagePath = '/product-images/' + req.file.filename;
    } else if (imageUrl?.trim()) {
      finalImagePath = imageUrl.trim();
    }

    const finalSlug = slug || generateSlug(name);
    const db = await initDB();

    const result = await db.run(`
      INSERT INTO products 
        (name, description, price, sku, imagePath, publishDate, slug, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, description || '', price || 0, sku || '', finalImagePath,
      publishDate || '', finalSlug, quantity || 1
    ]);

    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
    res.status(201).json(transformMultipleImages(newProduct));
  } catch (error) {
    console.error('❌ Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
}

// ---------------------------------------------------------------------------
// ✏️ PUT /api/products/:slug - Update product
// ---------------------------------------------------------------------------
async function updateProductBySlug(req: Request<{ slug: string }>, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const {
      name, description, price, sku,
      imageUrl, imageUrl2, imageUrl3, imageUrl4, imageUrl5,
      publishDate, quantity, sortOrder
    } = req.body;

    const toFinalPath = (url?: string) => url?.trim() || '';
    const db = await initDB();

    const result = await db.run(`
      UPDATE products
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          price = COALESCE(?, price),
          sku = COALESCE(?, sku),

          imagePath  = CASE WHEN ? != '' THEN ? ELSE imagePath END,
          imagePath2 = CASE WHEN ? != '' THEN ? ELSE imagePath2 END,
          imagePath3 = CASE WHEN ? != '' THEN ? ELSE imagePath3 END,
          imagePath4 = CASE WHEN ? != '' THEN ? ELSE imagePath4 END,
          imagePath5 = CASE WHEN ? != '' THEN ? ELSE imagePath5 END,

          publishDate = COALESCE(?, publishDate),
          quantity    = COALESCE(?, quantity),
          sortOrder   = COALESCE(?, sortOrder)
      WHERE slug = ?
    `, [
      name, description, price, sku,
      toFinalPath(imageUrl), toFinalPath(imageUrl),
      toFinalPath(imageUrl2), toFinalPath(imageUrl2),
      toFinalPath(imageUrl3), toFinalPath(imageUrl3),
      toFinalPath(imageUrl4), toFinalPath(imageUrl4),
      toFinalPath(imageUrl5), toFinalPath(imageUrl5),
      publishDate, quantity, sortOrder, slug
    ]);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Product not found or no changes made' });
      return;
    }

    const updatedProduct = await db.get('SELECT * FROM products WHERE slug = ?', [slug]);
    res.json(transformMultipleImages(updatedProduct));
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

// ---------------------------------------------------------------------------
// ❌ DELETE /api/products/:slug - Remove product
// ---------------------------------------------------------------------------
async function deleteProductBySlug(req: Request<{ slug: string }>, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const db = await initDB();

    const result = await db.run('DELETE FROM products WHERE slug = ?', [slug]);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}

// ---------------------------------------------------------------------------
// 🚏 Register Routes
// ---------------------------------------------------------------------------
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);
router.post('/', upload.single('imageFile'), createProduct);
router.put('/:slug', updateProductBySlug);
router.delete('/:slug', deleteProductBySlug);

export default router;
