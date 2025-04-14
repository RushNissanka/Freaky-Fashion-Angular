import express, { Request, Response } from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';

const app = express();
const PORT = 3000;

// ✅ CORS Setup
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Serve images statically
app.use('/product-images', express.static('product-images'));

// ✅ Health check
app.get('/', (req: Request, res: Response) => {
  res.send('👋 Hello from the backend! Use /api/products to access the products API.');
});

// ✅ Mount product routes (⚠️ do NOT double mount /products again inside the router)
app.use('/api/products', productRoutes);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
