import express from 'express';
import cors from 'cors';

import productosRoutes from './routes/productos.routes.js';
import authRoutes from './routes/auth.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);

export default app;