import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export type FileData = {
  key: string;
  size?: number;
  lastModified: string;
};

export type ResponseFileData = {
  success: boolean;
  files: FileData[];
};

type UseFileDownloadReturn = {
  fileData: FileData | null;
  isLoading: boolean;
  isDownloading: boolean;
  error: string | null;
  downloadFile: () => Promise<void>;
};

export const useFileDownload = (fileId: string | undefined): UseFileDownloadReturn => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) {
      setError('ID de archivo inválido.');
      setIsLoading(false);
      return;
    }

    const fetchFileInfo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<ResponseFileData>(`/search?searchTerm=${fileId}&exactMatch=false`);
        const data = response.data;

        if (!data.success || data.files.length === 0) {
          throw new Error('El archivo no existe o ya expiró.');
        }

        setFileData(data.files[0]);
      } catch {
        setError('El archivo no existe o ya expiró.');
        setFileData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileInfo();
  }, [fileId]);

  const downloadFile = useCallback(async () => {
    if (!fileData) return;

    setIsDownloading(true);
    setError(null);

    try {
      // Codificar el nombre del archivo para manejar caracteres especiales
      const encodedKey = encodeURIComponent(fileData.key);
      
      // Obtener URL de descarga firmada
      const response = await axios.get(`/download-url/${encodedKey}`);
      const { downloadUrl, success } = response.data;

      if (!success || !downloadUrl) {
        throw new Error('No se pudo obtener la URL de descarga.');
      }

      // Descargar el archivo como blob
      const blobResponse = await axios.get(downloadUrl, {
        responseType: 'blob',
      });

      // Crear blob URL local y descargar
      const blobUrl = window.URL.createObjectURL(blobResponse.data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileData.key);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Liberar el blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al descargar el archivo.');
    } finally {
      setIsDownloading(false);
    }
  }, [fileData]);

  return {
    fileData,
    isLoading,
    isDownloading,
    error,
    downloadFile,
  };
};
