import {
	getUploadUrlHandler,
	getDownloadUrlHandler,
	initiateMultipartUploadHandler,
	getMultipartPartUrlHandler,
	completeMultipartUploadHandler,
	abortMultipartUploadHandler,
} from "../controllers/fileController";
import { Router } from "express";

export const fileRouter = Router();

// Obtener URL firmada para subir directo (cliente PUT a R2)
fileRouter.post("/upload-url", getUploadUrlHandler);

// Multipart upload (archivos grandes)
fileRouter.post("/upload-multipart/initiate", initiateMultipartUploadHandler);
fileRouter.post("/upload-multipart/part-url", getMultipartPartUrlHandler);
fileRouter.post("/upload-multipart/complete", completeMultipartUploadHandler);
fileRouter.post("/upload-multipart/abort", abortMultipartUploadHandler);

// Obtener URL de descarga para un archivo
fileRouter.get("/download-url/:fileName", getDownloadUrlHandler);
