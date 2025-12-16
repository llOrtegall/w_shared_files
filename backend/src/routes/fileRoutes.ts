import { Router } from "express";
import {
  getUploadUrlHandler,
} from "../controllers/fileController";

export const fileRouter = Router();

// Obtener URL firmada para subir directo (cliente PUT a R2)
fileRouter.post("/upload-url", getUploadUrlHandler);
