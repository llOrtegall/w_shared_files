import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from "cors";
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (Opcional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// "Base de datos" en memoria
const fileDatabase = {}; 

// --- CAMBIO 1: MULTER AHORA GENERA NOMBRES ÚNICOS ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Generamos: "timestamp-nombreOriginal" (Ej: 1625245-foto.png)
    // Así garantizamos que NUNCA se repitan los nombres en el disco.
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// --- ENDPOINT 1: SUBIR ARCHIVO ---
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // ID corto para el link
  const fileId = uuidv4().split('-')[0];

  // Guardamos la relación entre el nombre feo y el bonito
  fileDatabase[fileId] = {
    id: fileId,
    originalName: req.file.originalname, // "foto.png" (Para mostrar al usuario)
    filename: req.file.filename,         // "1625245-foto.png" (Para buscar en disco)
    size: req.file.size,
    uploadDate: new Date()
  };

  const frontendLink = `http://localhost:5173/download/${fileId}`;
  res.json({ shareLink: frontendLink });
});

// --- ENDPOINT 2: OBTENER INFO ---
app.get('/api/file-info/:id', (req, res) => {
    const fileId = req.params.id;
    const fileData = fileDatabase[fileId];
    if (!fileData) return res.status(404).json({ error: 'Archivo no encontrado' });
    res.json(fileData);
});

// --- CAMBIO 2: NUEVO ENDPOINT DE DESCARGA INTELIGENTE (POR ID) ---
// Ahora pedimos la descarga usando el ID, no el nombre del archivo.
app.get('/api/download-content/:id', (req, res) => {
    const fileId = req.params.id;
    const fileData = fileDatabase[fileId];

    if (!fileData) {
        return res.status(404).send("El archivo ya no existe o el enlace expiró.");
    }

    // Buscamos el archivo en disco usando el "nombre único"
    const filePath = path.join(__dirname, 'uploads', fileData.filename);
  
    // Pero le decimos al navegador que lo descargue con el "nombre original"
    res.download(filePath, fileData.originalName, (err) => {
      if (err) {
        console.error("Error en descarga:", err);
        if (!res.headersSent) res.status(404).send("Error al descargar");
      }
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corregido corriendo en puerto ${PORT}`));