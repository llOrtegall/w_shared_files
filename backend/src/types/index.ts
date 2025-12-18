export interface UploadUrlResponse {
  success: boolean;
  uploadUrl?: string;
  key?: string;
  publicUrl?: string;
  expiresIn?: number;
  error?: string;
}

export type DownloadUrlResponse = {
  success: boolean;
  downloadUrl?: string;
  key?: string;
  expiresIn?: number;
  error?: string;
  LastModified?: Date | undefined;
};