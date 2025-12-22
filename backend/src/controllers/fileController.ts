import {
  getUploadPresignedUrl,
  getDownloadPresignedUrl,
  initiateMultipartUpload,
  getMultipartPartPresignedUrl,
  completeMultipartUpload,
  abortMultipartUpload,
} from "../services/r2Service";
import { Request, Response } from "express";

/**
 * Controlador para obtener URL firmada de subida (PUT) y clave
 * El cliente sube el archivo directamente a R2 usando esta URL.
 */
export const getUploadUrlHandler = async (req: Request, res: Response) => {
  try {
    const { fileName, contentType, expectedSize } = req.body || {};

    if (!fileName || !contentType) {
      return res.status(400).json({
        success: false,
        error: "Se requiere fileName y contentType",
      });
    }

    const result = await getUploadPresignedUrl(
      fileName,
      contentType,
      typeof expectedSize === "number" ? expectedSize : undefined
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en getUploadUrlHandler:", error);
    return res.status(500).json({
      success: false,
      error: `Error al generar URL de subida: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};

/**
 * Inicia una subida multipart (para archivos grandes)
 */
export const initiateMultipartUploadHandler = async (req: Request, res: Response) => {
  try {
    const { fileName, contentType, expectedSize, partSize } = req.body || {};

    if (!fileName || !contentType) {
      return res.status(400).json({ success: false, error: "Se requiere fileName y contentType" });
    }

    const result = await initiateMultipartUpload(
      fileName,
      contentType,
      typeof expectedSize === "number" ? expectedSize : undefined,
      typeof partSize === "number" ? partSize : undefined
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en initiateMultipartUploadHandler:", error);
    return res.status(500).json({
      success: false,
      error: `Error al iniciar multipart: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};

/**
 * Obtiene URL firmada para subir una parte específica
 */
export const getMultipartPartUrlHandler = async (req: Request, res: Response) => {
  try {
    const { keyOrShortId, uploadId, partNumber, contentLength } = req.body || {};

    if (!keyOrShortId || !uploadId || typeof partNumber !== "number") {
      return res.status(400).json({ success: false, error: "Se requiere keyOrShortId, uploadId y partNumber" });
    }

    const result = await getMultipartPartPresignedUrl(
      keyOrShortId,
      uploadId,
      partNumber,
      typeof contentLength === "number" ? contentLength : undefined
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en getMultipartPartUrlHandler:", error);
    return res.status(500).json({
      success: false,
      error: `Error al generar URL de parte: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};

/**
 * Completa una subida multipart
 */
export const completeMultipartUploadHandler = async (req: Request, res: Response) => {
  try {
    const { keyOrShortId, uploadId, parts } = req.body || {};

    if (!keyOrShortId || !uploadId || !Array.isArray(parts)) {
      return res.status(400).json({ success: false, error: "Se requiere keyOrShortId, uploadId y parts" });
    }

    const normalizedParts = parts
      .filter((p: any) => p && typeof p.partNumber === "number" && typeof p.etag === "string")
      .map((p: any) => ({ partNumber: p.partNumber, etag: p.etag }));

    if (normalizedParts.length === 0) {
      return res.status(400).json({ success: false, error: "La lista de parts es inválida o vacía" });
    }

    const result = await completeMultipartUpload(keyOrShortId, uploadId, normalizedParts);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en completeMultipartUploadHandler:", error);
    return res.status(500).json({
      success: false,
      error: `Error al completar multipart: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};

/**
 * Aborta una subida multipart
 */
export const abortMultipartUploadHandler = async (req: Request, res: Response) => {
  try {
    const { keyOrShortId, uploadId } = req.body || {};

    if (!keyOrShortId || !uploadId) {
      return res.status(400).json({ success: false, error: "Se requiere keyOrShortId y uploadId" });
    }

    const result = await abortMultipartUpload(keyOrShortId, uploadId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en abortMultipartUploadHandler:", error);
    return res.status(500).json({
      success: false,
      error: `Error al abortar multipart: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};

/**
 * Controlador para obtener URL de descarga de un archivo
 */
export const getDownloadUrlHandler = async (req: Request, res: Response) => {
  try {
    let { fileName } = req.params;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        error: "Se requiere el nombre del archivo",
      });
    }

    // Decodificar el nombre del archivo en caso de caracteres especiales
    fileName = decodeURIComponent(fileName);

    const result = await getDownloadPresignedUrl(fileName);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en getDownloadUrlHandler:", error);
    return res.status(500).json({
      success: false,
      error: `Error al generar URL de descarga: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};
