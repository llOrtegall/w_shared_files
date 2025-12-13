import fileRoutes from './routes/fileRoutes.ts';
import express from 'express';
import path from 'node:path';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// API routes
app.use('/api/v1', fileRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));