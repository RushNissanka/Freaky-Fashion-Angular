"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const app = (0, express_1.default)();
const PORT = 3000;
// ✅ CORS Setup
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// ✅ Parse incoming JSON
app.use(express_1.default.json());
// ✅ Serve images statically
app.use('/product-images', express_1.default.static('product-images'));
// ✅ Health check
app.get('/', (req, res) => {
    res.send('👋 Hello from the backend! Use /api/products to access the products API.');
});
// ✅ Mount product routes (⚠️ do NOT double mount /products again inside the router)
app.use('/api/products', productRoutes_1.default);
// ✅ Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
