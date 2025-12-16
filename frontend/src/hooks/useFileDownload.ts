import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export type FileData = {
  key: string;
  downloadUrl: string;
  expiresIn: number;
  originalName: string;
};

type UseFileDownloadReturn = {
  fileData: FileData | null;
  isLoading: boolean;
  error: string | null;
  downloadFile: () => void;
};

export const useFileDownload = (fileId: string | undefined): UseFileDownloadReturn => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
        const response = await axios.get(`/download-url/${fileId}`);
        const data = response.data;

        if (!data?.success || !data.downloadUrl || !data.key) {
          throw new Error(data?.error || 'Respuesta inválida');
        }

        const originalName = data.key.includes('-')
          ? data.key.split('-').slice(1).join('-')
          : data.key;

        setFileData({
          key: data.key,
          downloadUrl: data.downloadUrl,
          expiresIn: data.expiresIn ?? 0,
          originalName,
        });
      } catch {
        setError('El archivo no existe o ya expiró.');
        setFileData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileInfo();
  }, [fileId]);

  const downloadFile = useCallback(() => {
    if (!fileData) return;

    // Usar la URL firmada para descargar directamente desde R2
    const link = document.createElement('a');
    link.href = fileData.downloadUrl;
    link.setAttribute('download', fileData.originalName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [fileData]);

  return {
    fileData,
    isLoading,
    error,
    downloadFile,
  };
};
