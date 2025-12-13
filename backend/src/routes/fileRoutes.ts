import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import fileController from '../controllers/fileController.ts';

const router = Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/file-info/:id', fileController.getFileInfo);
router.get('/download-content/:id', fileController.downloadFile);

export default router;
